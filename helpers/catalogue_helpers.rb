module CatalogueHelpers
  def collection_link(dor_id="")
    return false if dor_id == ""
    haml_tag :a, :class => "collection-link",
                 :target => "blank",
                 :title => "View this item on the Getty's collection pages.",
                 :href => "http://www.getty.edu/art/collection/objects/#{dor_id}" do
                   haml_tag :i, :class => "ion-link"
                 end
  end

  def find_in_catalogue(section=:info, key, value)
    data.catalogue.select do |cat, entry|
      entry[section][key] == value
    end
  end

  def find_discussion(entry)
    discussion_path = "discussion/" + entry[:meta][:discussion] + ".html"
    discussion = sitemap.find_resource_by_path(discussion_path)

    discussion.render(:layout => false)
      .gsub("fn:", "fn-discussion:")
      .gsub("fnref:", "fnref-discussion:")
  end

  def object_data(entry)
    haml_tag :div, :class => "object-data", :data => {
      :catalogue  => entry[:info][:cat],
      :dimensions => {
        :width    => main_view(entry)["pixel_width"],
        :height   => main_view(entry)["pixel_height"],
        :max_zoom => 5
      },
      :views    => entry[:views].to_json,
      :rotation => entry[:meta][:rotation] || false,
      :rheight  => entry[:meta][:rotation_height] || nil,
      :rwidth   => entry[:meta][:rotation_width] || nil
    }
  end

  def main_view(entry)
    entry[:views].find {|view| view["name"] == "Main"}
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
