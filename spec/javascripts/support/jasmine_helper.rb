#Use this file to set/override Jasmine configuration options
#You can remove it if you don't need it.
#This file is loaded *after* jasmine.yml is interpreted.
#
#Example: using a different boot file.
#Jasmine.configure do |config|
#   config.boot_dir = '/absolute/path/to/boot_dir'
#   config.boot_files = lambda { ['/absolute/path/to/boot_dir/file.js'] }
#end
#
#Example: prevent PhantomJS auto install, uses PhantomJS already on your path.
#Jasmine.configure do |config|
#   config.prevent_phantom_js_auto_install = true
#end

require "sprockets"

Jasmine.configure do |config|
  %w(source spec).each do |f|
    config.add_rack_path("/#{f}/", lambda {
      Sprockets::Environment.new do |env|
        env.append_path("#{f}/javascripts")
      end
    })
  end
end#
