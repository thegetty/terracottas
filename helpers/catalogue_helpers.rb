module CatalogueHelpers
  def collection_link(dor_id)
    haml_tag :a, :class => "collection-link",
                 :target => "blank",
                 :title => "View this item on the Getty's collection pages.",
                 :href => "http://www.getty.edu/art/collection/objects/#{dor_id}" do
                   haml_tag :i, :class => "ion-link"
                 end
  end

  def find_in_catalogue(key, value)
    data.terracottas.select { |item| item[key] == value }
  end

  def discussion_text(id)
    path = find_discussion(id)
    discussion = sitemap.find_resource_by_path(path)

    # Return a hash with discussion attributes and namespaced footnotes
    {
      :title => discussion.metadata[:page]["title"],
      :text  => discussion.render(:layout => false)
        .gsub("fn:", "fn-discussion:")
        .gsub("fnref:", "fnref-discussion:")
    }
  end

  def find_discussion(id)
    case id
    when 1..3    then "discussion/discussion-a.html"
    when 4..23   then "discussion/discussion-b.html"
    when 38..41  then "discussion/discussion-c.html"
    when 45..46  then "discussion/discussion-d.html"
    when 47..48  then "discussion/discussion-e.html"
    end
  end

  # TODO: Refactor this method into something more manageable
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

  def has_rotation?(id)
    data.img_index.find { |item| item[:cat] == id }.rotation || false
  end

  def next_entry(id = 0)
    range = 1..59
    return false unless range.include?(id)
    haml_tag :a, :id     => "next-link",
                 :class  => "next-link",
                 :href   => "#{site_url}/catalogue/#{id + 1}/" do
                   haml_tag :i, :class => "ion-chevron-right"
                 end
  end

  def prev_entry(id = 0)
    range = 2..60
    return false unless range.include?(id)
    haml_tag :a, :id     => "prev-link",
                 :class  => "prev-link",
                 :href   => "#{site_url}/catalogue/#{id - 1}/" do
                   haml_tag :i, :class => "ion-chevron-left"
                 end
  end
end
