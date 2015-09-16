module CatalogueHelpers
  def object_data(id)
    object = data.terracottas.find { |item| item[:cat] == id }
    layers = data.img_index.find { |item| item[:cat] == id }
    haml_tag :div, :class => "object-data", :data => {
      :catalogue  => object.cat.to_s,
      :dimensions => {
        :width    => object.pixel_width,
        :height   => object.pixel_height,
        :max_zoom => object.max_zoom
      },
      :views => layers.to_json
    }
  end

  def find_in_catalogue(key, value)
    data.terracottas.select { |item| item[key] == value }
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
    return false if essay.nil?
    html = essay.render(:layout => false)
    html.gsub("fn:", "fn-discussion:").gsub("fnref:", "fnref-discussion:")
  end
end
