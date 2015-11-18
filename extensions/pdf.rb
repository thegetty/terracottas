class PDF < Middleman::Extension
  option :print_template
  # option :output_path

  def initialize(app, options_hash={}, &block)
    super

    app.after_build do |builder|
      input_path  = "extensions/filelist.txt"
      output_path = "source/assets/downloads/terracottas.pdf"
      puts `prince --input-list=#{input_path} -o #{output_path}`
      puts `rm #{input_path}`
    end
  end

  def after_configuration
    pdf_proxy(app.data.catalogue)
  end

  def manipulate_resource_list(resources)
    pagelist = generate_pagelist
    baseurl  = "build/"
    frontmatter, entries, backmatter = sort_contents(resources)

    frontmatter.each { |p| pagelist.puts baseurl + p.destination_path }
    entries.each     { |p| pagelist.puts baseurl + p.destination_path }
    backmatter.each  { |p| pagelist.puts baseurl + p.destination_path }
    pagelist.close

    # return value of this method becomes the new sitemap
    resources
  end

  private
  def generate_pagelist
    f  = File.new("./extensions/filelist.txt", "w")
  end

  def pdf_proxy(collection)
    collection.each do |cat, entry|
      app.proxy "/print-catalogue/#{cat}.html", options.print_template,
        :locals => { :entry => entry }, :ignore => true
    end
  end

  def sort_contents(resources)
    pages       = resources.find_all { |p| p.data.sort_order }
    pages.delete_if { |p| p.data.pdf_output == false }

    frontmatter = pages.find_all     { |p| p.data.sort_order < 100 }
    backmatter  = pages.find_all     { |p| p.data.sort_order >= 100 }
    entries     = resources.find_all { |p| p.data.catalogue == true }

    entries.select!      { |p| p.destination_path.include? "print-catalogue"}
    frontmatter.sort_by! { |p| p.data.sort_order }
    backmatter.sort_by!  { |p| p.data.sort_order }
    entries.sort_by!     { |p| p.metadata[:locals][:entry][:info][:cat] }

    return frontmatter, entries, backmatter
  end
end

::Middleman::Extensions.register(:pdf, PDF)
