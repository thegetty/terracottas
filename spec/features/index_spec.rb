require "spec_helper"

describe "index", :type => :feature, js: true do
  before do
    visit "/"
  end

  it "has correct cover title" do
    page.should have_selector ".cover-title"
    within ".cover-title" do
      page.should have_content /Ancient Terracottas from South Italy and Sicily/i
    end
  end

  it "has correct subtitle" do
    page.should have_selector ".cover-subtitle"
    within ".cover-subtitle" do
      page.should have_content /In the J. Paul Getty Museum/i
    end
  end

  it "has correct author name" do
    page.should have_selector ".cover-author"
    within ".cover-author" do
      page.should have_content /Maria Lucia Ferruzza/
    end
  end

  it "has a map" do
    page.should have_selector "#map"
  end

  it "successfully initializes leaflet.js" do
    page.should have_selector ".leaflet-container"
  end

  it "has a menu button" do
    page.should have_selector "#off-canvas-toggle"
  end

  it "should have a nav menu" do
    page.should have_selector "#nav-primary"
  end

  it "should open the nav menu when icon is clicked", :driver => :selenium do
    page.find("#off-canvas-toggle").click
    page.should have_selector ".nav-primary.visible"
  end

  it "should go to the TOC page when TOC link is clicked" do
    within ".main-content" do
      click_link "Contents"
      current_path.should eq("//contents/")
    end
  end
end
