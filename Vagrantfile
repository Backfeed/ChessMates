# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "blockchess-host"
  config.vm.provision 'shell', :privileged => false, :path => 'provision.sh'
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 27017, host: 27017
  config.vm.synced_folder ".", "/vagrant", type: "rsync",
    rsync__args: ["--verbose", "--archive", "--delete", "-z", "--copy-links"],
    rsync__exclude: [
      ".meteor/local/",
      ".git/",
      ".idea/",
      ".npm/",
      ".build/",
      "node_modules/",
      # Add your own local packages that you created in the app here:
      # "+ /<MY_APP>/packages/<MY_PACKAGE>/***",
      "/*/packages/**"
    ]
end
