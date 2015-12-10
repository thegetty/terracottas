require "spec_helper"

describe "catalogue page", :type => :feature, js: true do
  before do
    range = 1..60
    random_entry = range.to_a.sample
    visit "/catalogue/#{random_entry}/"
  end

  it "should have an object-header element" do
    page.should have_selector ".object-header"
  end

  it "should have correct information inside object header" do
    within ".object-header" do
      page.should have_selector ".object-meta", :count => 2
      page.should have_selector ".object-title"
    end
  end

  it "has an object-info table in the correct location" do
    page.click_link "Expand All"
    within ".object-content" do
      page.should have_selector ".object-info"
    end
  end

  it "has a map element" do
    page.should have_selector "#map"
  end
  
#  it "can successfully enter full-screen mode" do
#    page.find("#fullscreen-toggle").trigger
#    page.should have_selector ".panel-left.panel--expand"
#  end

  it "has a link to the collection page" do
    page.click_link "Expand All"
    within ".object-info" do
      page.should have_selector ".collection-link"
      visit page.find(".collection-link")[:href]
    end
  end
end
