# Use this script as metadata when starting up the server in Compute Engine

set -v

# Talk to the metadata server to get the project id
PROJECTID=$(curl -s "http://metadata.google.internal/computeMetadata/v1/project/project-id" -H "Metadata-Flavor: Google")

# Install logging monitor. The monitor will automatically pick up logs sent to
# syslog.
curl -s "https://storage.googleapis.com/signals-agents/logging/google-fluentd-install.sh" | bash
service google-fluentd restart &

# Install Stackdriver Agent
curl -sSO https://dl.google.com/cloudagents/install-monitoring-agent.sh
bash install-monitoring-agent.sh

# Create a nodeapp user. The application will run as this user.
useradd -m -d /home/nodeapp nodeapp

# Install dependencies from apt
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
apt-get update
apt-get install -yq ca-certificates git nodejs build-essential supervisor
mkdir -p /home/nodeapp/.npm-packages
chown nodeapp:nodeapp /home/nodeapp/.npm-packages
echo 'prefix=${HOME}/.npm-packages' >> /home/nodeapp/.npmrc
chown nodeapp:nodeapp /home/nodeapp/.npmrc
echo 'NPM_PACKAGES="${HOME}/.npm-packages"' >> /home/nodeapp/.bashrc
echo 'PATH="$NPM_PACKAGES/bin:$PATH"' >> /home/nodeapp/.bashrc
echo 'unset MANPATH' >> /home/nodeapp/.bashrc
echo 'export MANPATH="$NPM_PACKAGES/share/man:$(manpath)"' >> /home/nodeapp/.bashrc

# Get the application source code from the Google Cloud Repository.
# git requires $HOME and it's not set during the startup script.
export HOME=/root
git config --global credential.helper gcloud.sh
#git clone https://source.developers.google.com/p/$PROJECTID/r/node-gce-demo /opt/app
git clone https://source.developers.google.com/p/$PROJECTID/r/elasticsearch-node-autocomplete /opt/app

# copy in the config.json file from Cloud Storage Bucket
#gsutil cp gs://$PROJECTID.appspot.com/config.json /opt/app/config.json

# Install app dependencies
cd /opt/app/
npm install

# Change permissions of git clone
chown -R nodeapp:nodeapp /opt/app

# Start up server
su - nodeapp -c 'cd /opt/app; npm start'

# Configure supervisor to run the node app.
#cat >/etc/supervisor/conf.d/node-app.conf << EOF
#[program:nodeapp]
#directory=/opt/app/7-gce
#command=npm start
#autostart=true
#autorestart=true
#user=nodeapp
#environment=HOME="/home/nodeapp",USER="nodeapp",NODE_ENV="production"
##stdout_logfile=syslog
#stderr_logfile=syslog
#EOF

#supervisorctl reread
#supervisorctl update

# Application should now be running under supervisor

