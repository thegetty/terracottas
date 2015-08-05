# == Dependencies ==============================================================
require 'rake'
require 'yaml'
require 'nokogiri'
require 'fileutils'
require 'zip'
require 'pathname'
require 'rmagick'

# == Helpers ===================================================================

# Execute a system command
def execute(command)
  system "#{command}"
end

# == Configuration =============================================================

# Set "rake watch" as default task
task :default => :markdown_convert

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
  source_files = Pathname.glob "#{input_path.to_s}/*.docx"

  source_files.each do |file|
    base = file.basename.to_s.split("#{file.extname}").first
    execute("pandoc --from=docx --to=markdown --smart --normalize --output=#{output_path.to_s}/#{base}.md #{file.to_s}")
  end
end

#-------------------------------------------------------------------------------
# rake resize
# rake resize["path","250"]
# based on: http://www.calebwoods.com/2015/02/01/batch-resizing-images-ruby/
#-------------------------------------------------------------------------------
desc "Batch resize images"
task :resize, [:target, :size] do |t, args|
  @directory = Pathname(File.expand_path(args[:target]))
  @size      = args[:size] || 1025

  def resize_image(file)
    img = Magick::Image.read(file).first
    resized = img.resize_to_fit(@size)

    resized_path = @directory.join('resized', File.basename(file))
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