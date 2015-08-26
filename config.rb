require "extensions/views"

activate :views
activate :directory_indexes

# Global site settings
set :relative_links, true
set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :fonts_dir, 'assets/fonts'
set :layout, 'layouts/application'
set :partials_dir, 'partials'
set :markdown_engine, :kramdown
set :markdown, :parse_block_html => true
set :site_title, "Ancient Terracottas"
set :site_url, ""

page "/catalogue/*", :layout => :object
page "/frontmatter/*", :layout => :page
page "/discussion/*", :layout => :page


configure :development do
 activate :livereload
 set :debug_assets, true
end

configure :build do
  # Relative assets needed to deploy to Github Pages
  # activate :relative_assets
  set :site_url, "/Terracottas"
  set :http_prefix, "/Terracottas"
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
  deploy.branch = 'gh-pages'
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
    Tilt['markdown'].new { text }.render
  end
end
