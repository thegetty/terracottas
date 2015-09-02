require "extensions/views"

activate :views
activate :directory_indexes

# Global site settings
set :relative_links, true
set :css_dir, "assets/stylesheets"
set :js_dir, "assets/javascripts"
set :images_dir, "assets/images"
set :fonts_dir, "assets/fonts"
set :layout, "layouts/application"
set :partials_dir, "partials"
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
  deploy.branch = "gh-pages"
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

  def object_data(id)
    object = data.terracottas.find { |item| item[:cat] == id }
    haml_tag :div, :class => "object-data", :data => {
      :catalogue  => object.cat.to_s,
      :dimensions => {
        :width    => object.pixel_width,
        :height   => object.pixel_height,
        :max_zoom => object.max_zoom
      }
    }
  end

  def discussion_text(id)
    case id
    when 1..3
      essay = sitemap.find_resource_by_path("discussion/discussion-a.html")
    when 4..23
      essay = sitemap.find_resource_by_path("discussion/discussion-b.html")
    when 38..41
      essay = sitemap.find_resource_by_path("discussion/discussion-c.html")
    when 45..46
      essay = sitemap.find_resource_by_path("discussion/discussion-d.html")
    else
      puts "No Discussion Found"
    end
    html = essay.render(:layout => false) unless essay.nil?
    html.gsub("fn:", "fn-discussion:").gsub("fnref:", "fnref-discussion:")
  end
end
