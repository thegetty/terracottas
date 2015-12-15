require "spec_helper"

describe "map", :type => :feature, js: true do
  before do
    visit "/map/"
  end

  it "has a map element on the page" do
    page.should have_selector "#map"
  end

  it "successfully initializes leaflet.js" do
    page.should have_selector ".leaflet-container"
  end

  it "can successfully zoom in and zoom out" do
    page.click_link "Zoom in"
    page.click_link "Zoom out"
  end

  it "contains clickable marker elements" do
    within ".leaflet-marker-pane" do
      page.first(".leaflet-marker-icon").click
    end
  end
end
