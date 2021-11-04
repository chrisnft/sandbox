###
# Dockerfile
###

FROM buildpack-deps:latest

ARG \
	USERNAME=sandbox \
	PASSWORD=sandbox \
	GROUPNAME=sandbox \
	GROUP_ID=1000 \
	USER_ID=1000 \
	TZ=America/Chicago \
	TERM=xterm-256color \
	HOME=/home/sandbox \
	NODE_VER=14.18.1 \
	HOSTNAME=machine \
	NEOVIM_VER=0.5.1

# WARNING: DONT CHANGE XDG PATHS
ENV \
	LANGUAGE=en \
	LANG=C.UTF-8 \
	WORKSPACE=${HOME}/dev \
	PLAYGROUND=${HOME}/playground \
	HOSTNAME=${HOSTNAME} \
	LANG=${LANG} \
	TZ=${TZ} \
	TERM=${TERM} \
	SHELL=/usr/bin/zsh \
	EDITOR=nvim \
	XDG_CONFIG_HOME=${HOME}/.config \
	XDG_DATA_HOME=${HOME}/.local/share \
	XDG_CACHE_HOME=${HOME}/.cache \
	XDG_STATE_HOME=${HOME}/.state \
	XDG_FONTS_HOME=${HOME}/.local/share/fonts \
	XDG_DOTFILES_HOME=${HOME}/.dotfiles \
	XDG_BIN_HOME=${HOME}/.local/bin

# TODO: easier to not sert xdg and zsh path?
# WARNING: DONT CHANGE ZSH paths
ENV \
	ZSH=${XDG_DATA_HOME}/oh-my-zsh \
	ZDOTDIR=${XDG_CONFIG_HOME}/zsh \
	ZSH_CUSTOM=${XDG_CONFIG_HOME}/zsh/custom \
	NVM_DIR=${XDG_CONFIG_HOME}/nvm \
	NODE_VER=${NODE_VER} \
	NEOVIM_DIR=${XDG_DATA_HOME}/nvim \
	LVIM_CONFIG_DIR=$XDG_CONFIG_HOME/lvim \
	LVIM_CONFIG_FILE=$XDG_CONFIG_HOME/lvim/config.lua \
	NPM_CONFIG_PREFIX=${HOME}/.npm-global

RUN \
	# Install packages \
	DEBIAN_FRONTEND=noninteractive \
	TZ=${TZ} \
	curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
	&& apt-get update -y \
	&& apt-get install -y \
	zsh \
	fzf \
	sudo \
	less \
	ripgrep \
	fd-find \
	rsync \
	python3-pip \
	universal-ctags \
	nodejs \
	unzip \
	# Replace default fd command \
	&& ln -s $(which fdfind) /usr/local/bin/fd \
	# Setup user \
	&& addgroup --gid ${GROUP_ID} ${GROUPNAME} \
	&& adduser \
	--quiet \
	--disabled-password \
	--shell ${SHELL} \
	--home ${HOME} \
	--uid ${USER_ID} \
	--gid ${GROUP_ID} \
	--gecos ' ' \
	${USERNAME} \
	&& echo "${USERNAME}:${PASSWORD}" | chpasswd \
	&& usermod -aG sudo ${USERNAME} \
	&& unset ${PASSWORD} \
	# Create xdg directories and ZDOTDIR \
	&& mkdir -p \
	${XDG_DATA_HOME} \
	${XDG_CONFIG_HOME} \
	${XDG_BIN_HOME} \
	${XDG_CACHE_HOME} \
	${XDG_FONTS_HOME} \
	${XDG_STATE_HOME} \
	${WORKSPACE} \
	${PLAYGROUND} \
	${ZDOTDIR} \
	${XDG_CACHE_HOME}/zsh \
	&& apt-get clean autoclean \
	&& apt-get autoremove --yes \
	&& rm -rf /var/lib/{apt,dpkg,cache,log}/ \
	# Set ownership permissions for $HOME recursively \
	&& chown -R $USERNAME:$GROUPNAME ${HOME}

USER ${USERNAME}

ENV PATH=${XDG_BIN_HOME}:${NPM_CONFIG_PREFIX}/bin:$PATH

WORKDIR ${HOME} 

# Setup local dev environment
RUN \
	npm install -g yarn \
	# Setup dotfiles \
	# ================== \
	&& echo "> Setup dotfiles..." \
	&& git clone https://github.com/chrisnft/dotfiles.git "${XDG_DOTFILES_HOME}" \
	&& echo "> Setting up ~/.config" \
	&& rsync --exclude 'zsh/custom/themes/' --exclude 'zsh/custom/plugins/' -av "${XDG_DOTFILES_HOME}/.config/" "${XDG_CONFIG_HOME}/" \
	&& mkdir -p "${ZDOTDIR}/custom/plugins" "${ZDOTDIR}/custom/themes" \
	&& touch ~/.cache/zsh/history \
	# Add .ssh/config \
	&& echo "> Setting up ~/.ssh" \
	&& mkdir -p ~/.ssh && chmod 700 ~/.ssh \
	&& rsync -av "${XDG_DOTFILES_HOME}/.ssh/" "${HOME}/.ssh/" \
	&& chmod 600 ~/.ssh/config \
	# Install zsh \
	# ================== \
	&& echo "> Installing ZSH..." \
	&& sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
	# Install oh-my-zsh themes and plugins \
	# ================== \
	&& echo "Installing ZSH themes and plugins..." \
	&& git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM}/themes/powerlevel10k \
	&& git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM}/plugins/zsh-completions \
	&& git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting \
	# Install Nerdfonts \
	# ================== \
	&& echo "> Installing Nerdfonts" \
	&& curl -o "${XDG_FONTS_HOME}/Droid Sans Mono for Powerline Nerd Font Complete.otf" -fL https://github.com/ryanoasis/nerd-fonts/raw/master/patched-fonts/DroidSansMono/complete/Droid%20Sans%20Mono%20Nerd%20Font%20Complete.otf \
	# Install NVM, Node, and yarn globally \
	# ================== \
	# && echo "> Installing NVM, NODE, and yarn..." \
	# && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
	# && . ${NVM_DIR}/nvm.sh \
	# && nvm install "${NODE_VER}" \
	# && nvm use node \
	# && npm install --global yarn \
	# Install Neovim \
	# ================== \
	&& echo "> Installing Neovim..." \
	&& NEOVIM_URL=https://github.com/neovim/neovim/releases/download/v${NEOVIM_VER}/nvim.appimage \
	&& wget ${NEOVIM_URL} -P ${NEOVIM_DIR} \
	&& cd ${NEOVIM_DIR} \
	&& chmod u+x nvim.appimage \
	&& ./nvim.appimage --appimage-extract \
	&& ln -s ${NEOVIM_DIR}/squashfs-root/usr/bin/nvim ${XDG_BIN_HOME}/nvim \
	# Install Neovim package manager Packer \
	# ================== \
	&& echo "> Installing Neovim package manager..." \
	&& git clone --depth 1 https://github.com/wbthomason/packer.nvim ~/.local/share/nvim/site/pack/packer/start/packer.nvim \
	# Install Lunarvim \
	# ================== \
	# Add lunarvim dependencies \
	&& echo "> Installing Lunarvim dependencies..." \
	&& pip install neovim \
	&& yarn global add neovim tree-sitter-cli \
	# Clone Lunarvim repo \
	&& echo "> Cloning Lunarvim repo..." \
	&& LUNARVIM_DIR=${XDG_DATA_HOME}/lunarvim/lvim \
	&& git clone https://github.com/LunarVim/LunarVim.git "${LUNARVIM_DIR}" \
	# Install Lunarvim \
	&& echo "> Installing Lunarvim... (Ignore error output)" \
	&& cd ${LUNARVIM_DIR}/utils/installer \
	&& yes | ./install.sh \
	; ./install_bin.sh \
	; echo "> Syncing neovim packages... This could take a couple minutes..." \
	# TODO: Packersync from command line without sleep \
	; lvim --headless -c 'PackerSync' -c 'sleep 120' -c 'qa' \
	# Not workinng in Dockerfile, run anyways \
	# ; lvim --headless -c 'autocmd User PackerComplete quitall' -c 'PackerSync' \
	#  Install solidity language server \
	; echo "> Installing solang languageserver..." \
	; wget https://github.com/hyperledger-labs/solang/releases/download/v0.1.8/solang-linux -P ${XDG_BIN_HOME} \
	&& cd ${XDG_BIN_HOME} \
	&& mv solang-linux solang \
	&& chmod +x solang \
	&& echo "Finished sandbox environment..."

WORKDIR ${HOME}

CMD ["node"]
