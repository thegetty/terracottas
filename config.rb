require "extensions/views"
require "extensions/pdf"
require "yaml"

activate :views
activate :directory_indexes

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
end

# Global site settings
set :relative_links,  true
set :css_dir,         "assets/stylesheets"
set :js_dir,          "assets/javascripts"
set :images_dir,      "assets/images"
set :fonts_dir,       "assets/fonts"
set :layout,          "layouts/application"
set :partials_dir,    "partials"
set :markdown_engine, :kramdown
set :markdown,        :parse_block_html => true
set :site_title,      "Ancient Terracottas"
set :site_url,        ""

configure :development do
  activate :livereload
end

configure :build do
  activate :relative_assets     # Needed for Github Pages
  activate :minify_css
  activate :minify_javascript
  activate :gzip
  activate :minify_html

  activate :imageoptim do |options|
    options.image_extensions = %w(.jpg)
    options.pngout = false
    options.svgo   = false
  end

  activate :pdf do |pdf|
    pdf.print_template = "/catalogue/print-template.html"
    # pdf.output_path    = "/pdf/terracottas.pdf"
  end

  set :site_url, "/Terracottas"
end

data.catalogue.each do |cat, entry|
  proxy "/catalogue/#{cat}.html", "/catalogue/template.html", :locals => {
    :entry => entry
  }, :ignore => true
end

ignore "/catalogue/print-template.html"
page "/discussion/*", :layout => :page

helpers do
  def nav_link(link_text, page_url, options = {})
    options[:class] ||= ""
    if current_page.url.length > 1
      current_url = current_page.url.chop
    else
      current_url = current_page.url
    end
    options[:class] << " active" if page_url == current_url
    link_to(link_text, page_url, options)
  end

  def markdown(text)
    Tilt["markdown"].new { text }.render
  end
end
