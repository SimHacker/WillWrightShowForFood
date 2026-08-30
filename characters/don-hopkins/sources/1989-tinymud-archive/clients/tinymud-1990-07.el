;;; Major Mode for talking to TinyMUD
;;; by James Aspnes (asp@cs.cmu.edu) and Stewart Clamen (clamen@cs.cmu.edu)
;;; 1989, 1990

(defvar tinymud-server "daisy.learning.cs.cmu.edu"
  "*Host with running tinymud game.")

(defvar tinymud-port 4201
  "*Port to connect to on tinymud-server.")

(defvar tinymud-name "TinyMUD"
  "*Name of TinyMUD server to connect to.")

(defvar tinymud-prompt ?>
  "Prompt character for TinyMUD mode.")

(defvar tinymud-page-regexp "You sense that [^ ]* is looking for you in "
  "Regular expression for detecting pages.")

(defvar tinymud-connection-error-string
  "Either that player does not exist, or has a different password.")

(defvar tinymud-show-page nil
  "*If non-nil, pop up tinymud buffer whenever a page arrives.")

(defvar tinymud-reconnect-regexp
  "#### Please reconnect to \\([^@]*\\)@\\([^ @]*\\) *\\(\\|([^ @]*)\\) port \\([0-9]+\\) ####.*$"
  "Regular expression for detecting reconnect signals.")

(defconst tinymud-new-connectionp nil
  "Flag to identify hail for new connection")

(defvar tinymud-accept-reconnects nil
  "*If nil, reject reconnect signals. If non-nil, accept reconnect signals 
by breaking existing connection and establishing new connection.  If an
integer, spawn <n> connections before breaking any.")

(defun tinymud-check-reconnect ()
  "Look for reconnect signal and open new connection if non to that
site already exists."
  (goto-char (point-min))
  (while (not (eobp))
    (if (and tinymud-accept-reconnects (looking-at tinymud-reconnect-regexp))
	(let ((tinymud-name (buffer-substring (match-beginning 1)
					      (match-end 1)))
	      (tinymud-server-addr (buffer-substring (match-beginning 2)
						     (match-end 2)))
	      (tinymud-server (and (not (eq (match-beginning 3)
					    (match-end 3)))
				   (buffer-substring (1+ (match-beginning 3))
						     (1- (match-end 3)))))
	      (tinymud-port (string-to-int
			     (buffer-substring (match-beginning 4)
					       (match-end 4)))))
	  (delete-region (match-beginning 0) (match-end 0))
	  (let* ((tinymud-buffer-name (concat "*" tinymud-name "*"))
		 (tinymud-buffer-process
		  (get-buffer-process tinymud-buffer-name)))

	    (cond
	     (tinymud-buffer-process ; No existing connection to that site...
	      (message "Connection to that site already established."))
	     ((not tinymud-server)
	      (message "GNU Emacs cannot handle nonsymbolic names.  Sorry."))
	     ((zerop tinymud-port)
	      (message "Illformed portal signal. Inform Builder."))
	     (t
	      (save-excursion
		(setq tinymud-new-connectionp tinymud-buffer-name)
		(tinymud t)))))))
    (beginning-of-line 2)))


(defun tinymud-check-page ()
  "Look for page message, and pop-up buffer if specified."
  (goto-char (point-min))
  (while (not (eobp))
    (if (and tinymud-show-page (looking-at tinymud-page-regexp))
	(progn
	  (display-buffer (current-buffer))
	  (message "You are being paged in %s"
		   (buffer-name (current-buffer)))))
    (beginning-of-line 2)))


(defun tinymud-fill-lines ()
  "Fill buffer line by line."
  (goto-char (point-min))
  (while (not (eobp))
    (let ((break (move-to-column (1+ fill-column))))
      (if (<= break fill-column)
	  (beginning-of-line 2)
	;; else fill
	(skip-chars-backward "^ \n")
	(if (bolp)
	    ;; can't fill, we lose
	    (beginning-of-line 2)
	  (delete-horizontal-space)
	  (insert ?\n))))))

(defvar tinymud-filter-hook
  '(tinymud-check-reconnect tinymud-check-page tinymud-fill-lines)
  "*List of functions to call on each line of tinymud output.  The
function is called with no arguments and the buffer narrowed to just
the line.") 

(defun tinymud-filter (proc string)
  "Filter for input from TinyMUD process.  Also, if recently
established new connection automatically, check to see if number
of active connections exceeded connection limit and delete current
process if so."
  (save-excursion
    (set-buffer (process-buffer proc))
    (goto-char (marker-position (process-mark proc)))
    (let ((start (point)))
      (insert-before-markers string)
      (let ((end (point)))
	(subst-char-in-region start end ?\^m ?\  t)
	(goto-char start)
	(beginning-of-line nil)
	(save-restriction
	  (narrow-to-region (point) end)
	  ;; call tinymud-filter-hook
	  (run-hooks 'tinymud-filter-hook)
	  (if (process-mark proc)
	      (set-marker (process-mark proc) (point-max)))))))
  (if tinymud-new-connectionp
      (progn
	(if (or			     ; Do we close current connection?
	     (not (numberp tinymud-accept-reconnects))
	     (let ((c tinymud-accept-reconnects) (l (process-list)))
	       (while l
		 (if (and (eq (process-filter (car l)) 'tinymud-filter)
			  (eq (process-status (car l)) 'run))
		     (setq c (1- c)))
		 (setq l (cdr l)))
	       (< c 0)))
	    (progn
	      (delete-process (get-buffer-process (current-buffer)))
	      (kill-buffer (current-buffer))))
	(progn
	  (pop-to-buffer tinymud-new-connectionp)
	  (if (> (baud-rate) search-slow-speed) (recenter))
	  (setq tinymud-new-connectionp nil)))))



(defun tinymud-connect-filter (proc string)
  "Filter for connecting to a TinyMUD server.  Replaced with tinymud-filter
once successful."
  (if (not (string-equal string tinymud-connection-error-string))
      (set-process-filter proc 'tinymud-filter)))

(defun tinymud-send ()
  "Send current line of input to TinyMUD."
  (interactive)
  (let ((proc (get-buffer-process (current-buffer))))
    (cond ((or (null proc)
	       (not (eq (process-status proc) 'open)))
	   (message "Not connected--- nothing sent.")
	   (insert ?\n))
	  (t
	   ;; process exists, send line
	   ;; moving to end of current line first
	   (beginning-of-line 1)
	   (let ((start (max (process-mark proc) (point))))
	     (if (equal (char-after start) tinymud-prompt)
		 (setq start (1+ start)))
	     (goto-char start)
	     (end-of-line 1)
	     (send-region proc start (point))
	     (send-string proc "\n")
	     (goto-char (point-max))
	     (insert ?\n)
	     (move-marker (process-mark proc) (point))
	     (insert tinymud-prompt))))))

(defun tinymud-quit ()
  "Quit TinyMUD process."
  (interactive)
  (if (yes-or-no-p "Are you sure you want to quit tinymud?")
      (delete-process (get-buffer-process (current-buffer)))))

(defvar tinymud-mode-map
  (let ((map (make-sparse-keymap)))
    (define-key map "\n" 'tinymud-realign-and-send)
    (define-key map "\r" 'tinymud-send)
    (define-key map "\^c\^c" 'tinymud-quit)
    (define-key map "\^c\^m" 'tinymud-macro-command)
    map)
  "Keymap for tinymud-mode.")

(defun tinymud-mode ()
  "Major Mode for talking to inferior TinyMUD processes.

Commands: 
\\{tinymud-mode-map}
Variables: [default in brackets]

 tinymud-server					[\"daisy.learning.cs.cmu.edu\"]
    Symbolic host name of TinyMUD server.  
 tinymud-port					[4201]
    (Integer) port number of TinyMUD server.
 tinymud-name					[\"TinyMUD\"]
    (String) name for TinyMUD server.  
 tinymud-show-page				[nil]
    If non-nil, pop up tinymud buffer whenever a page arrives.
 tinymud-accept-reconnects			[nil]
    If nil, reject reconnect signals. If non-nil, accept reconnect
    signals by breaking existing connection and establishing new
    connection.  If an integer, spawn that many connections before
    breaking any.
 tinymud-filter-hook 
    List of hooks to call before displaying output from TinyMUD
    process to tinymud buffer.  [Default hooks support line-filling,
    page checking, and reconnect detection.]
 tinymud-macro-commands-alist			['(\"nil\" . \"\")]
    Alist of commands macros.  
 tinymud-macro-commands-file			[\"~/.tinymud_macros\"]
    Pathname to file containing command macros (written in
    emacs-lisp).  Should SETQ tinymud-macro-commands-alist.
 tinymud-passwd-file				[\"~/.tinymud\"]
    Pathname to location of TinyMUD character/password file. 
 tinymud-mode-hook				[nil]
    Hook to run at startup.  Users wishing to use macros may want to
    bind it to the following in their .emacs file:

     (setq tinymud-mode-hook
           '(lambda ()
    	  (tinymud-load-macro-commands tinymud-macro-commands-file)))

"
  (interactive)
  (kill-all-local-variables)
  (setq mode-name "TinyMUD")
  (setq major-mode 'tinymud-mode)
  (set-syntax-table text-mode-syntax-table)
  (use-local-map tinymud-mode-map)
  (make-local-variable 'mode-line-process)
  (let* ((s (and (concat "@" tinymud-server)))
	 (ss (cond ((not tinymud-accept-reconnects) "")
		   (t (if (> (length s) 20) (substring s 0 20) s)))))
    (setq mode-line-process (list (concat ss ":%s"))))
  (make-local-variable 'tinymud-filter-hook)
  (run-hooks 'tinymud-mode-hook))

(defun tinymud (&optional autoconnect)
  "Connect to TinyMUD.  

Connects to a tinymud server defined by the variables tinymud-server, 
tinymud-port, and tinymud-name.

With optional argument, look in tinymud-passwd-file 
for name to connect with and attempt connect."
  (interactive "P")
  (let* ((buf (get-buffer-create (concat "*" tinymud-name "*")))
	 (proc (get-buffer-process buf)))
    (if (and proc (eq (process-status proc) 'open))
	(switch-to-buffer buf)
      ;; else we have to start it
      (if proc (delete-process proc))
      (let ((proc (open-network-stream "TinyMUD" buf
				       tinymud-server tinymud-port)))
	(if autoconnect
	    (let ((entry (tinymud-read-entry tinymud-name)))
	      (set-process-filter proc 'tinymud-connect-filter)
	      (tinymud-send-string
	       (mapconcat '(lambda (x) x) (cons "connect" entry) " ")
	       proc)))
	(set-process-filter proc 'tinymud-filter)	    
	(switch-to-buffer buf)
	(goto-char (point-max))
	(set-marker (process-mark proc) (point))
	(insert tinymud-prompt)
	(tinymud-mode)
	))))
			   
;;; Macro Commands

(defvar tinymud-current-process nil
  "Current TinyMUD process")

(defvar tinymud-macro-expansion-mode-map
  (let ((map (make-sparse-keymap)))
    (define-key map "\^c\^c" 'tinymud-macro-send)
    (define-key map "\^c\^s" 'tinymud-macro-send)
    (define-key map "\^c\^]" 'tinymud-macro-abort)
    (define-key map "\^c\^d" 'tinymud-macro-define)
    map)
  "Keymap for tinymud-macro-expansion-mode.")

(defun tinymud-macro-expansion-mode ()
  "Major Mode for mucking with TinyMUD macro expansion.
Commands:
\\{tinymud-macro-expansion-mode-map}
"
  (interactive)
  (kill-all-local-variables)
  (setq mode-name "TinyMUD-Macro-Expansion")
  (setq major-mode 'tinymud-macro-expansion-mode)
  (set-syntax-table text-mode-syntax-table)
  (use-local-map tinymud-macro-expansion-mode-map)
  (make-local-variable 'tinymud-expansion-macro-name)
  (make-local-variable 'tinymud-current-process)
  (message "Use ^C^C to send, ^C^] to abort..."))

(defun tinymud-macro-define (name)
  "Define buffer as tinymud-macro."
  (interactive (list (completing-read "MUD Macro: "
				      tinymud-macro-commands-alist
				      nil nil
				      tinymud-expansion-macro-name)))
  (let ((oldval (assoc name tinymud-macro-commands-alist)))
    (if oldval
	(setcdr oldval (buffer-string))
      (setq 
       tinymud-macro-commands-alist
       (cons
	(cons name (buffer-string))
	tinymud-macro-commands-alist))))
  (if (y-or-n-p "Save to file? ")
      (tinymud-store-macro-commands
       (expand-file-name
	(read-file-name (concat "File to save to (default "
				tinymud-macro-commands-file
				"): ")
			"~/"
			tinymud-macro-commands-file)))))


(defun tinymud-macro-abort ()
  "Abort macro expansion buffer."
  (interactive)
  (kill-buffer (current-buffer))
  (delete-window))

(defun tinymud-macro-send ()
  "Abort macro expansion buffer."
  (interactive)
  (let ((str (buffer-string))
	(proc tinymud-current-process))
    (tinymud-macro-abort)
    (tinymud-send-string str proc)))

(defvar tinymud-macro-commands-alist (list (cons "nil" ""))
  "*Alist of macros (keyed by strings)")

(defun tinymud-send-string (string proc)
  "Send STRING as input to PROC"
  (send-string proc (concat string "\n")))

(defvar tinymud-macro-commands-file "~/.tinymud_macros"
  "*Pathname of tinymud macros.")

(defun tinymud-load-macro-commands (filename)
  "Load file of tinymud-macros"
  (if (file-exists-p filename)
      (progn
	(setq tinymud-macro-commands-file filename)
	(load-file filename))
    (setq tinymud-macro-commands-alist '("nil" . ""))))

(defun tinymud-store-macro-commands (filename)
  "Store tinymud-macros in filename"
  (interactive "FFile to save to: ")
  (setq tinymud-macro-commands-file filename)
  (save-excursion
    (let ((tmp (get-buffer-create " *Macros to write*")))
      (set-buffer tmp)
      (erase-buffer)
      (insert "(setq tinymud-macro-commands-alist '\n"
	      (prin1-to-string tinymud-macro-commands-alist)
	      ")")
      (write-file filename))))





(defun tinymud-macro-command (arg)
  "Insert into stream one of the commands in tinymud-macro-commands-alist.
Without command argument, opens buffer for editting.  With argument
sends alist entry directly to process."
  (interactive "P")
  (let ((macro
	 (assoc
	  (or (if (stringp arg) arg)
	      (completing-read "MUD Macro: "
			       tinymud-macro-commands-alist nil t nil))
	  tinymud-macro-commands-alist)))
    (let ((match (car macro))
	  (stuff (cdr macro)))
      (if (stringp stuff)
	  (let ((buff (get-buffer-create "*Expansion*"))
		(proc (get-buffer-process (current-buffer))))
	    (if (not arg)
		(progn
		  (pop-to-buffer buff)
		  (erase-buffer)
		  (insert stuff)
		  (goto-char (point-min))
		  (tinymud-macro-expansion-mode)
		  (setq tinymud-expansion-macro-name match)
		  (setq tinymud-current-process proc)
		  )
	      (tinymud-send-string stuff tinymud-current-process)))))))

(defun tinymud-realign-and-send ()
  (interactive)
  (recenter 0)
  (tinymud-send))


;;; Reading from entry file

(defvar tinymud-passwd-file "~/.tinymud"
  "*Pathname to location of TinyMUD character/password file.")

(defun tinymud-read-entry (site &optional file)
  "Read tinymud entries from tinymud-passwd-file."
  (setq file (expand-file-name (or file tinymud-passwd-file)))
  (let ((entry
	 (let ((buffer nil)
	       (obuf (current-buffer))
	       (match nil))
	   (unwind-protect
	       (progn
		 (setq buffer (generate-new-buffer "mailrc"))
		 (buffer-flush-undo buffer)
		 (set-buffer buffer)
		 (cond ((get-file-buffer file)
			(insert (save-excursion
				  (set-buffer (get-file-buffer file))
				  (buffer-substring (point-min) (point-max)))))
		       ((not (file-exists-p file)))
		       (t (insert-file-contents file)))
		 ;; Don't lose if no final newline.
		 (goto-char (point-max))
		 (or (eq (preceding-char) ?\n) (newline))
		 (goto-char (point-min))
		 ;; handle "\\\n" continuation lines
		 (while (not (eobp))
		   (end-of-line)
		   (if (= (preceding-char) ?\\)
		       (progn (delete-char -1) (delete-char 1) (insert ?\ ))
		     (forward-char 1)))
		 (goto-char (point-min))
		 (while (re-search-forward (concat "^" site) nil t)
		   (re-search-forward "[^ \t]+")
		   (let* ((name (buffer-substring (match-beginning 0)
						  (match-end 0)))
			  (start (progn (skip-chars-forward " \t") (point))))
		     (end-of-line)
		     (setq match
			   (list name (buffer-substring start (point)))))))
	     (if buffer (kill-buffer buffer))
	     (set-buffer obuf))
	   match)))
    (cond (entry)
	  ((string-equal site "default") nil)
	  (t (tinymud-read-entry "default" file)))))
      
