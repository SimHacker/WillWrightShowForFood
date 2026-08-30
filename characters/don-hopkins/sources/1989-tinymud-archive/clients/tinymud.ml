;;; Major Mode for talking to TinyMUD

(setq right-margin 72)

(setq-default mud-directory "/tumtum/don/emacs/")
(setq-default mud-server "daisy.learning.cs.cmu.edu")
;(setq-default mud-server "uokmax.ecn.uoknor.edu")
(setq-default mud-address "2147670554")
;(setq-default mud-address "3223544331")
(setq-default mud-port 4201)
;(setq-default mud-port 6250)
(setq-default mud-buffer-name "*MUD*")
(setq-default mud-prompt ">")
(setq-default mud-line-action-buffer "tinymud-line-actions")
(setq-default mud-name-action-buffer "tinymud-name-actions")
(setq-default mud-last-room "")
(setq-default mud-current-room "limbo")
(setq-default mud-room-mark 1)
(setq-default mud-it "me")
(setq-default mud-it-mark 1)

(save-window-excursion
  (visit-file (concat mud-directory mud-line-action-buffer))
  (visit-file (concat mud-directory mud-name-action-buffer))
)

(declare-buffer-specific @mud-name)
(declare-buffer-specific @mud-password)

(declare-buffer-specific @mud-frame)

(defun (mud $name $password $buffer
  (setq $name (arg 1 ": mud (name) "))
  (setq $password (arg 2 ": mud (password) "))
  (setq $buffer (concat $name "@mud"))
  (error-occurred (kill-process $buffer))
  (pop-to-buffer $buffer)
  (setq @mud-name $name)
  (setq @mud-password $password)
  (text-mode)
  (start-interactive-process
;    (concat "telnet " mud-server " " mud-port)
    (concat 
      "setenv NEWSSERVER " mud-address "." mud-port
      " ; /usr/NeWS/bin/psh")
    $buffer)
  (listener-mode 1)
  (setq @process-output-filter "#mud-connect-filter")
  (setq @mud-frame (current-frame))
  (local-bind-to-key "mud-mouse-look"	    	    "\e ")
  (local-bind-to-key "mud-mouse-make-room"	    "\e\n")
  (error-occurred
    (local-bind-to-key "mud-mouse-look"	    #mouse-middle)
    (local-bind-to-key "mud-mouse-make-room"	    #mouse-meta-middle)
  )
))

(defun (#mud-connect-filter
  (setq mud-buffer-name (current-buffer-name))
  (remove-^M)
  (string-to-mud (concat "connect " @mud-name " " @mud-password "\n"))
;  (string-to-mud "OUTPUTPREFIX ========")
  (string-to-mud "OUTPUTSUFFIX --------")
  (message "Connecting to " @mud-name " ...")
  (setq @process-output-filter "#mud-output-filter")
))

(defun (#mud-output-filter $line $name $rest $action $end
  (setq mud-buffer-name (current-buffer-name))
  (remove-^M)
  (save-restriction
    (save-excursion
      (narrow-region)
      (while (! (eobp))
	 (setq $action 0)
	 (looking-at "\\(\\([^\n ]*\\) *\\(.*\\)\\)")
	 (region-around-match 3)
	 (setq $rest (region-to-string))
	 (region-around-match 2)
	 (setq $name (region-to-string))
	 (region-around-match 1)
	 (setq $line (region-to-string))
	 (if (> (length $line) 70)
	   (progn
	     (save-restriction
	       (insert-string "\n")
	       (backward-character)
	       (narrow-region)
	       (beginning-of-line)
	       (while (! (error-occurred
			     (provide-prefix-argument 72
				 (forward-character))))
		 (move-to-column 72)
		 (backward-word)
		 (if (| (= (preceding-char) 9) ; tab
			(= (preceding-char) 10)) ; newline
		   (forward-word)
		 )
		 (insert-string "\n\t")
	       )
	       (end-of-file)
	     )
	     (delete-next-character)
	     )
	 )
	 (error-occurred (forward-character))
	 (temp-use-buffer mud-line-action-buffer
	   (save-excursion
	     (beginning-of-file)
	     (if (! (error-occurred 
		      (search-forward (concat "\n " $line "\t"))))
	       (progn
		 (set-mark)
		 (end-of-line)
		 (setq $action (region-to-string))
	       )
	     )
	   )
	 )
	 (if (!= $action 0)
	   (eval-mlisp $action)
	   (progn
	     (temp-use-buffer mud-name-action-buffer
	       (save-excursion
		 (beginning-of-file)
		 (if (! (error-occurred
			  (search-forward (concat "\n " $name "\t"))))
		   (progn
		     (set-mark)
		     (end-of-line)
		     (setq $action (region-to-string))
		   )
		 )
	       )
	     )
	     (if (!= $action 0)
	       (eval-mlisp $action)
	     )
	   )
	 )
      )
    )
  )
  (update-text-view)
))

(defun (string-to-mud $str
  (setq $str (concat (arg 1 ": string-to-mud ") "\n"))
;  (while (!= $str "")
;    (string-to-process mud-buffer-name (substr $str 1 80))
;    (setq $str (substr $str 81 -1))
;  )
  (string-to-process mud-buffer-name $str)
  (update-text-view)
))

(defun (update-text-view
  (temp-use-buffer mud-buffer-name
    (switch-to-frame @mud-frame)
    (if (eobp)
      (progn
	(end-of-file)
	(line-to-bottom-of-window)
	(scroll-one-line-up)
        (save-command-context)
      )
    )
    (sit-for 1)
  )
))

(defun (mud-name-log
  (append-string-to-buffer (concat $name "-log")
      (concat $line "\n")
  )
))

(defun (mud-author-room $f
  (if (!= mud-current-room mud-last-room)
    (error-occurred
      (setq mud-last-room mud-current-room)
      (edit-article mud-current-room)
      (with-entry "article" mud-current-room
	(switch-to-frame entry-frame)
	(save-command-context)
      )
    )
  )
  (message mud-current-room)
))

(bind-to-key "mud-author-room" "\e[4201e")

(defun (room
  (message "Room: " $line)
  (setq mud-current-room $line)
  (setq mud-room-mark (dot))
  (error-occurred
    (push-back-string "\e[4201e")
  )
))

(defun (mud-select-it
  (save-excursion
    (if (bolp)
      (end-of-line))
    (set-mark)
    (beginning-of-line)
    (if (looking-at ".*(\\(#[0-9][0-9]*\\))$")
      (region-around-match 1)
    )
    (setq mud-it (region-to-string))
    (setq mud-it-mark (dot))
    (message "It is \"" mud-it "\".")
    (update-text-view)
  )
))

(defun (mud-mouse-look
    (error-occurred (#to-mouse-context))
    (mud-select-it)
    (mud-look-it)
))

(defun (mud-kbd-look
    (mud-select-it)
    (mud-look-it)
))

(defun (mud-look-it
  (string-to-mud (concat "look " mud-it))
))

(defun (mud-take-it
  (string-to-mud (concat "take " mud-it))
))

(defun (mud-drop-it
  (string-to-mud (concat "drop " mud-it))
))

(defun (mud-say-it
  (string-to-mud (concat "say " mud-it))
))

(defun (mud-rob-it
  (string-to-mud (concat "rob " mud-it))
))

(defun (mud-room-it
  (mud-make-room mud-it)
))

(defun (mud-make-room $room-description
  (temp-use-buffer mud-line-action-buffer
    (end-of-file)
    (insert-string " " mud-it "\t(room)\n")
  )
  (edit-article mud-it)
))

(defun (mud-mouse-make-room
  (error-occurred (#to-mouse-context))
  (make-room)
))

(defun (mud-update-room $room-text $room-name $room-buf $room-line
  (save-window-excursion
    (switch-to-buffer mud-room-mark)
    (goto-character mud-room-mark)
    (beginning-of-line)
    (previous-line)
    (set-mark)
    (end-of-line)
    (setq $room-name (region-to-string))
    (end-of-file)
    (setq $room-text (region-to-string))
    (edit-article $room-name)
    (if (!= ""
	    (with-entry "article" $room-name
	      (author-entry)
	      (current-buffer-name)
	    )
	)
      (progn
	(beginning-of-file)
	(set-mark)
	(if (error-occurred (re-search-forward "^[=-][=-]*$"))
	  (progn
	    (end-of-file)
	    (insert-string "\n--------\n")
	    (previous-line)
	  )
	)
	(beginning-of-line)
	(delete-to-killbuffer)
	(save-restriction 
	  (set-mark)
	  (narrow-region)
	  (insert-string $room-text)
	  (beginning-of-file)
	  (insert-string "~")
	  (end-of-line)
	  (insert-string "~\n")
	  (forward-character)
	  (end-of-line)
	  (insert-string "\n")
	  (error-occurred
	      (next-line)
	      (insert-string "\n")
	      (next-line)
	      (insert-string)
	      
	  )
	  (while (& (! (eobp))
		    (! (looking-at "^[=-][=-]*$")))
	    (set-mark)
	    (end-of-line)
	    (setq $room-line (region-to-string))
	    (if (find-article $room-line)
		(progn
		  (beginning-of-line)
		  (insert-string "~")
		  (end-of-line)
		  (insert-string "~")
		)
		(find-picture $room-line)
		(progn
		  (beginning-of-line)
		  (insert-string ".picture <")
		  (end-of-line)
		  (insert-string ">\n")
		  (insert-string ".mud <look " $room-line ">")
		)
		(progn
	          (beginning-of-line)
		  (insert-string ".mud <look ")
		  (end-of-line)
		  (insert-string ">")
		)
	    )
;	    (insert-string "\n")
	    (error-occurred (forward-character))
	  )
	  (set-mark)
	  (end-of-file)
	  (erase-region)
	  (beginning-of-file)
	  (message-for 1 "Filtering text ...")
	  (filter-region "fmt")
	)
      )
    )
  )
))
