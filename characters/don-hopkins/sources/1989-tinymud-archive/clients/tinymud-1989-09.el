;;; Major Mode for talking to TinyMUD

(defvar tinymud-server "lancelot.avalon.cs.cmu.edu"
 "Host with running tinymud game.")

(defvar tinymud-port 4201
 "Port to connect to on tinymud-server.")

(defvar tinymud-buffer-name "*TinyMUD*"
 "Name of tinymud buffer.")

(defvar tinymud-prompt ?>
 "Prompt character for TinyMUD mode.")

(defun tinymud-filter (proc string)
 "Filter for input from tinyMUD process."
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
		  (insert ?\n)))))
	  (if (process-mark proc)
	      (set-marker (process-mark proc) (point-max))))))))

(defun tinymud-send ()
 "Send current line of input to tinymud."
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
	   (let ((start (point)))
	     (if (equal (char-after start) tinymud-prompt)
		 (setq start (1+ start)))
	     (end-of-line 1)
	     (send-region proc start (point))
	     (send-string proc "\n")
	     (goto-char (point-max))
	     (insert ?\n)
	     (move-marker (process-mark proc) (point))
	     (insert tinymud-prompt))))))

(defun tinymud-quit ()
 "Quit tinymud."
 (interactive)
 (if (yes-or-no-p "Are you sure you want to quit tinymud?")
     (delete-process (get-buffer-process (current-buffer)))))

(defvar tinymud-mode-map
 (let ((map (make-sparse-keymap)))
   (define-key map "\n" 'tinymud-send)
   (define-key map "\r" 'tinymud-send)
   (define-key map "\^c\^c" 'tinymud-quit)
   (define-key map "\^c\^m" 'tinymud-macro-command)
   map)
 "Keymap for tinymud-mode.")

(defun tinymud-mode ()
 "Major Mode for talking to TinyMUD."
 (interactive)
 (kill-all-local-variables)
 (setq mode-name "TinyMUD")
 (setq major-mode 'tinymud-mode)
 (set-syntax-table text-mode-syntax-table)
 (use-local-map tinymud-mode-map)
 (make-local-variable 'mode-lin-process)
 (setq mode-line-process '(":%s"))
 (run-hooks 'tinymud-mode-hook))

(defun tinymud ()
 "Connect to TinyMUD."
 (interactive)
 (let* ((buf (get-buffer-create tinymud-buffer-name))
	 (proc (get-buffer-process buf)))
   (if (and proc (eq (process-status proc) 'open))
	(switch-to-buffer buf)
     ;; else we have to start it
     (if proc (delete-process proc))
     (let ((proc (open-network-stream "TinyMUD" buf
				       tinymud-server tinymud-port)))
	(set-process-filter proc 'tinymud-filter)
	(switch-to-buffer buf)
	(goto-char (point-max))
	(set-marker (process-mark proc) (point))
	(insert tinymud-prompt)
	(tinymud-mode)))))
			   
;; Macro Commands

(defvar tinymud-macro-commands-alist nil
 "*Alist of macros (keyed by strings)")

(defun tinymud-macro-command ()
 "Insert into stream one of the commands in tinymud-macro-commands-alist."
 (interactive)
 (let ((stuff
	 (assoc
	  (completing-read "MUD Macro: "
			   tinymud-macro-commands-alist nil t nil)
	  tinymud-macro-commands-alist)))
   (if (stringp (cdr stuff))
	(insert (cdr stuff)))))
