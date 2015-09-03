# == Dependencies ==============================================================
require "rake"
require "yaml"
require "nokogiri"
require "fileutils"
require "zip"
require "pathname"
require "rmagick"

# == Helpers ===================================================================

# Execute a system command
def execute(command)
  system "#{command}"
end

# == Configuration =============================================================

# Set "rake watch" as default task
task :default => :markdown_convert

#-------------------------------------------------------------------------------
# rake image_index
# generate an image index YAML file based on the various views available in the
# gettypubs/maptiles repo on Github.
# Credentials should be stored in a secrets.yml file that is not in version control
desc "Generate a master list of image deep zoom views"
task :image_index do
  require "octokit"

  secrets = YAML::load_file(File.join(__dir__, "secrets.yml"))
  client  = Octokit::Client.new(
    :login => secrets["github_user"],
    :password => secrets["github_pw"]
  )
  repo    = "gettypubs/maptiles"
  images  = []

  client.contents(repo, :path => "terracottas").each do |item|
    image = { "cat" => item.name.to_i, "layers" => [] }
    views = client.contents(repo, :path => item.path)

    views.each do |view|
      layer = { "name" => view.name.capitalize.gsub("-", " "), "path" => view.path }
      image["layers"] << layer
    end
    images << image

    f = File.new("img_index.yml", "w")
    f.puts images.to_yaml
  end
end

#-------------------------------------------------------------------------------
# rake markdown_convert
# rake markdown_convert INPUT=path OUTPUT=path
# This is just a shortcut to batch-process files via PanDoc CLI
# PanDoc-Ruby does not seem to support docx files as well
#-------------------------------------------------------------------------------
desc "Convert Word Files to Markdown"
task :markdown_convert do
  input = ENV["INPUT"] || Dir.pwd
  output = ENV["OUTPUT"] || Dir.pwd

  input_path = Pathname.new("#{input}")
  output_path = Pathname.new("#{output}")
  source_files = Pathname.glob "#{input_path}/*.docx"

  source_files.each do |file|
    base = file.basename.to_s.split("#{file.extname}").first
    execute("pandoc --from=docx --to=markdown --smart --normalize --output=#{output_path}/#{base}.md #{file}")
  end
end

#-------------------------------------------------------------------------------
# rake resize
# rake resize["path","250"]
# based on: http://www.calebwoods.com/2015/02/01/batch-resizing-images-ruby/
#-------------------------------------------------------------------------------
desc "Batch resize images"
task :resize, [:target, :size] do |_t, args|
  @directory = Pathname(File.expand_path(args[:target]))
  @size      = args[:size] || 1025

  def resize_image(file)
    img = Magick::Image.read(file).first
    resized = img.resize_to_fit(@size)

    resized_path = @directory.join("resized", File.basename(file))
    resized.write(resized_path) do
      self.quality = 100
    end
    # free up RAM
    img.destroy!
    resized.destroy!
  end

  resize_dir = "#{@directory}/resized"
  unless File.directory? resize_dir
    # puts "Creating #{dir}/"
    Dir.mkdir resize_dir
  end

  files = Dir.glob "#{@directory}/*.{jpg,png,gif}"
  puts "Resizing #{files.size} images..."

  files.each do |file|
    puts "Resizing #{file}"
    resize_image(file)
  end
  puts "Finished resizing #{files.size} images"
end
