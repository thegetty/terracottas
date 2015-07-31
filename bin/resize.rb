#!/usr/bin/ruby
require 'rmagick'
require 'pathname'

@directory = Pathname(File.expand_path(ARGV[0]))
@size      = ARGV.fetch(1) { 1025 }

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
# unless File.directory? resize_dir
#   puts "Creating #{dir}/"
#   Dir.mkdir resize_dir
# end

files = Dir.glob "#{@directory}/*.{jpg,png,gif}"

puts "Resizing #{files.size} images..."

files.each do |file|
  puts "Resizing #{file}"
  resize_image(file)
end

puts "Finished resizing #{files.size} images"