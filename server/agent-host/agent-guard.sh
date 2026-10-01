#!/usr/bin/env bash
# agent-guard.sh — PreToolUse hook for the sysop agent. Same script as central's edgebox skill
# (skills/edgebox/templates/agent-host/agent-guard.sh); only deny.txt differs.
#
# Reads the hook's JSON on stdin, takes the shell command and any file path the tool names, and
# refuses the call if either matches a line of deny.txt (extended regex, one per line, # comments).
# Exit 2 with a message on stderr is the blocking result in Claude Code and VS Code agent hooks.
#
# This catches reflexes, not adversaries. sysop has sudo, so a determined agent can get around
# any string match. The real guards are Assisted mode (a human approves each command), the unit's
# cgroup limits, and a disk snapshot. See server/AGENTS-PLAN.md.
set -uo pipefail

DENY="${AGENT_GUARD_DENY:-$(dirname "$0")/deny.txt}"
input="$(cat)"

subject="$(jq -r '[.tool_input.command, .tool_input.cmd, .tool_input.file_path,
                   .tool_input.filePath, .tool_input.path] | map(select(. != null)) | join("\n")' \
	<<<"$input" 2>/dev/null)"
[[ -z "$subject" ]] && exit 0

while IFS= read -r pat; do
	[[ -z "$pat" || "$pat" == \#* ]] && continue
	if grep -Eq -- "$pat" <<<"$subject"; then
		echo "agent-guard: blocked (matches: $pat). This needs Don; say what you wanted to run and why." >&2
		exit 2
	fi
done <"$DENY"
exit 0
