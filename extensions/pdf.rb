class PDF < Middleman::Extension
  option :print_template
  # option :output_path

  def initialize(app, options_hash={}, &block)
    super

    app.after_build do |builder|
      input_path  = "extensions/filelist.txt"
      output_path = "source/assets/downloads/AncientTerracottas_Ferruzza.pdf"
      puts `prince --input-list=#{input_path} -o #{output_path}`
      puts `rm #{input_path}`
      puts `rm -rf build/print-catalogue/`
    end
  end

  def after_configuration
    pdf_proxy(app.data.catalogue)
  end

  def manipulate_resource_list(resources)
    pagelist = generate_pagelist
    baseurl  = "build"
    frontmatter, entries, backmatter = sort_contents(resources)

    frontmatter.each { |p| pagelist.puts baseurl + p.url + "index.html" }
    entries.each     { |p| pagelist.puts baseurl + p.url + "index.html" }
    backmatter.each  { |p| pagelist.puts baseurl + p.url + "index.html" }
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
    # TODO: refactor this method so that frontmatter is not a collection of
    # pre-existing HTML pages, but a new specially-prepared page with its own
    # layout. This should be easier to control for the purposes of print layout.

    pages       = resources.find_all { |p| p.data.sort_order }
    discussions = resources.find_all { |p| p.data.objects }

    pages.delete_if       { |p| p.data.pdf_output == false }
    discussions.delete_if { |p| p.destination_path.include? "views" }

    frontmatter = pages.find_all     { |p| p.data.sort_order < 100 }
    backmatter  = pages.find_all     { |p| p.data.sort_order >= 100 }
    entries     = resources.find_all { |p| p.data.catalogue == true }

    entries.select!      { |p| p.destination_path.include? "print-catalogue"}
    frontmatter.sort_by! { |p| p.data.sort_order }
    backmatter.sort_by!  { |p| p.data.sort_order }
    entries.sort_by!     { |p| p.metadata[:locals][:entry][:info][:cat] }

    # Add discussions at appropriate location
    discussions.each_with_index do |discussion, index|
      insert_location = discussion.data.objects.last + index
      entries.insert(insert_location, discussion)
    end

    return frontmatter, entries, backmatter
  end
end

::Middleman::Extensions.register(:pdf, PDF)
