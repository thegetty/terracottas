require "spec_helper"

describe "search", :type => :feature, js: true do
  before do
    visit "/contents/"
  end

  it "search results element exists on page" do
    page.should have_selector ".search-results"
  end

  it "hides search results by default" do
    ".search-results".should_not have_selector ".search-active"
  end

  it "opens the search mode when search is clicked", :driver => :selenium do
    page.find("#search").click
    page.should have_selector ".search-active"
    page.fill_in("search", :with => "Orpheus")
    page.should have_selector(".result-item", :count => 9)
  end

end
