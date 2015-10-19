require "yaml"
require "json"

# Setup
# ------------------------------------------------------------------------------
file_path       = "/Users/egardner/Dev/terracottas/source/views/catalogue/"
catalogue_path  = "/Users/egardner/Dev/terracottas/data/terracottas.yml"
index_path      = "/Users/egardner/Dev/terracottas/data/img_index.yml"
old_catalogue   = YAML.load_file(catalogue_path)
index           = YAML.load_file(index_path)
new_catalogue   = []

# Generate new catalogue array
# ------------------------------------------------------------------------------
old_catalogue.each do |object|
  index_match = index.find { |item| item["cat"].to_i == object["cat"].to_i }
  entry_path  = "#{file_path}#{object['cat']}.html.md"

  frontmatter = YAML.load_file(entry_path)
  content     = File.read(entry_path).gsub(/---(.|\n)*---/, "")
  new_object = {
    :info => {
      :cat        => object["cat"],
      :acc        => object["acc"],
      :dor_id     => object["dor_id"],
      :title      => object["title"],
      :group      => object["group"],
      :region     => object["region"],
      :city       => object["city"],
      :date       => object["date"],
      :typology   => object["typology"],
      :dimensions => object["dimensions"],
      :munsell    => object["munsell"]
    },
    :views => index_match["layers"],
    :meta => {
      :featured     => object["featured"],
      :feature_desc => object["feature_description"],
      :start_date   => object["start_date"],
      :end_date     => object["end_date"]
    },
    :content => {
      :fabric       => frontmatter["fabric"],
      :condition    => frontmatter["condition"],
      :provenance   => frontmatter["provenance"],
      :bibliography => frontmatter["bibliography"],
      :description  => content
    }
  }
  new_catalogue << new_object
end

new_catalogue.sort_by! { |item| item[:info][:cat] }


# Write to files
# ------------------------------------------------------------------------------
new_catalogue.each do |object|
  id = object[:info][:cat]
  f  = File.new("data/catalogue/#{id}.yml", "w")

  f.puts object.to_yaml line_width: 80
  f.close
end

# puts new_catalogue.sort_by { |item| item[:info][:acc]  }.to_yaml
# puts JSON.pretty_generate(new_catalogue)
