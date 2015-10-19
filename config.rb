require "extensions/views"
require "yaml"

activate :views
activate :directory_indexes

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

# Frontmatter defaults
page "/frontmatter/*", :layout => :page

configure :development do
  activate :livereload
end

configure :build do
  # Relative assets needed to deploy to Github Pages
  activate :relative_assets
  activate :minify_css
  activate :minify_javascript
  activate :gzip
  activate :minify_html
  activate :imageoptim
  set      :site_url, "/Terracottas"
end

activate :imageoptim do |options|
  options.image_extensions = %w(.jpg)
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
end

data.catalogue.each do |cat, entry|
  proxy "/catalogue/#{cat}.html", "/catalogue/template.html", :locals => {
    :entry => entry
  }, :ignore => true
end

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
