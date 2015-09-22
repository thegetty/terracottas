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

  def find_discussion(id)
    case id
    when 1..3
      path = "discussion/discussion-a.html"
    when 4..23
      path = "discussion/discussion-b.html"
    when 38..41
      path = "discussion/discussion-c.html"
    when 45..46
      path = "discussion/discussion-d.html"
    when 47..48
      path = "discussion/discussion-e.html"
    else
      return nil
    end
  end

  def discussion_text(id)
    path = find_discussion(id)
    {
      :title => sitemap.find_resource_by_path(path).metadata[:page]["title"],
      :text  => sitemap.find_resource_by_path(path).render(:layout => false)
        .gsub("fn:", "fn-discussion:")
        .gsub("fnref:", "fnref-discussion:")
    }
  end
end
