module CatalogueHelpers
  def merge_catalogue
    terracottas = []
    data.catalogue.each do |key, value|
      terracottas << value
    end

    terracottas.sort_by { |item| item[:info][:cat]  }
  end

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
    rotation = ""

    if entry[:meta][:rotation]
      rotation = 1
    else
      rotation = 0
    end

    haml_tag :div, :class => "object-data", :data => {
      :catalogue  => entry[:info][:cat],
      :dimensions => {
        :width    => main_view(entry)["pixel_width"],
        :height   => main_view(entry)["pixel_height"],
        :max_zoom => 5
      },
      :views    => entry[:views].to_json,
      :rotation => rotation,
      :rheight  => entry[:meta][:rotation_height] || nil,
      :rwidth   => entry[:meta][:rotation_width] || nil
    }
  end

  def main_view(entry)
    entry.views.sort_by { |view| view.name }.first
  end

  def prev_page(id = 0)
    pages = sitemap.resources.find_all { |p| p.data.sort_order }
    if id == 100
      destination = "#{site_url}/catalogue/60"
      haml_tag :a, :id     => "prev-link",
                   :class  => "prev-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-left"
                   end
    else
      prev_page = sitemap.resources.find { |p| p.data.sort_order == id - 1 }
      return false if prev_page.nil?
      destination = "#{site_url}#{prev_page.url}"
      haml_tag :a, :id     => "prev-link",
                   :class  => "prev-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-left"
                   end
    end
  end

  def next_page(id = 0)
    pages = sitemap.resources.find_all { |p| p.data.sort_order }
    if id == 10
      destination = "#{site_url}/catalogue/1"
      haml_tag :a, :id     => "next-link",
                   :class  => "next-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-right"
                   end
    else
      next_page = sitemap.resources.find { |p| p.data.sort_order == id + 1 }
      return false if next_page.nil?
      destination = "#{site_url}#{next_page.url}"
      haml_tag :a, :id     => "next-link",
                   :class  => "next-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-right"
                   end
    end
  end

  def next_entry(id = 60)
    if id == 60
      next_page = sitemap.resources.find { |p| p.data.sort_order == 100 }
      return false if next_page.nil?
      destination = "#{site_url}#{next_page.url}"
      haml_tag :a, :id     => "next-link",
                   :class  => "next-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-right"
                   end
    else
      destination = "#{site_url}/catalogue/#{id + 1}/"
      haml_tag :a, :id     => "next-link",
                   :class  => "next-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-right"
                   end
    end
  end

  def prev_entry(id = 1)
    if id == 1
      prev_page = sitemap.resources.find { |p| p.data.sort_order == 10 }
      return false if prev_page.nil?
      destination = "#{site_url}#{prev_page.url}"
      haml_tag :a, :id     => "prev-link",
                   :class  => "prev-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-left"
                   end
    else
      destination = "#{site_url}/catalogue/#{id - 1}/"
      haml_tag :a, :id     => "prev-link",
                   :class  => "prev-link hide-on-mobile",
                   :href   => destination do
                     haml_tag :i, :class => "ion-chevron-left"
                   end
    end
  end
end
