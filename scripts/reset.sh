#!/usr/bin/env bash
# Cleans and resets the working tree of the repository
# and its submodules to the latest commit
#
# References:
# https://git-scm.com/docs
# https://gist.github.com/nicktoumpelis/11214362
# https://gitlab.com/gitlab-org/gitlab/-/issues/331042

# Change the current working directory ($PWD) to the root of the
# repository to ensure this script always behaves consistently
cd $(git rev-parse --show-toplevel)

# Set ANSI color variables
color_off="\033[0m"
color_black="\033[0;30m"
color_red="\033[0;31m"
color_green="\033[0;32m"
color_yellow="\033[0;33m"
color_blue="\033[0;34m"
color_magenta="\033[0;35m"
color_cyan="\033[0;36m"
color_white="\033[0;37m"

# Reads a single input key
read_key() {
  echo -n -e "$1 "
  read -n 1 key
  echo
}

# Reads a single input key that answers a yes or no question
read_yes_no_key() {
  # Ask the question
  read_key "${color_yellow}$1${color_off}"
  # Loop until we get a valid answer
  while true; do
    case $key in
      [yY]) return 0 ;; # Yes
      [nN]) return 1 ;; # No
      *) read_key "${color_red}${2:-$1}${color_off}" # Ask again, complain, etc.
    esac
  done
}

# Prompts the user to answer a yes or no question
# and exits the script if the answer is no
confirm() {
  echo
  if ! read_yes_no_key "$1" "${2:-$1}"; then exit 1; fi
  echo
}

# Displays a message when a new step begins
step () {
  ((step_cur++))
  if (($step_cur > 1)); then echo; fi
  echo -e "${color_green}Step $step_cur of $step_max: ${color_magenta}$1${color_off}"
}

# Displays a message when the current step ends
pets () {
  echo -e "${color_cyan}Done.${color_off}"
}

# Check if there are any uncommitted changes in the repository
# If so, display the status and request confirmation to proceed
if [ -n "$(git status --porcelain)" ]; then
  git status
  confirm "Warning! This will obliterate the changes shown above. Should I proceed? (y/n)" \
          "Sorry, I didn't understand your answer. Please type 'y' to proceed or 'n' to exit. (y/n)"
fi

# Set step variables
step_cur=0
step_max=6

# Remove untracked files from the repository
# Note the use of double --force options is intentional
step "Cleaning repository..."
  git clean -d -x --force --force
  git submodule foreach --recursive git clean -d -x --force --force
pets

# Ensure the submodules are initialized
# Note this must occur prior to synchronizing below
step "Initializing submodules..."
  git submodule init
pets

# Synchronize the submodules with the remote .gitmodules file
step "Synchronizing submodules..."
  git submodule sync --recursive
pets

# Update the submodules
step "Updating submodules..."
  git submodule update --init --force --recursive
pets

# Reset the repository to the latest commit
step "Resetting repository..."
  git reset --hard --recurse-submodules
pets

# Clean again to ensure no untracked files remain
step "Cleaning repository..."
  git clean -d -x --force --force
  git submodule foreach --recursive git clean -d -x --force --force
pets
