require "middleman"
require 'rspec'
require 'capybara/rspec'
require 'capybara/webkit'

RSpec.configure do |config|
  config.color = true
end

Capybara.javascript_driver = :webkit
Capybara.default_max_wait_time = 5 
Capybara.app_host = 'http://localhost:4567/'

Capybara::Webkit.configure do |config|
  config.allow_url("cdn.rawgit.com")
  config.allow_url("api.mapbox.com")
  config.allow_url("gettypubs.github.io")
end

Capybara.app = Middleman::Application.server.inst do
  set :root, File.expand_path(File.join(File.dirname(__FILE__), '..'))
  set :environment, :development
  set :show_exceptions, false
end

