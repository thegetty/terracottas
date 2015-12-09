require "spec_helper"

describe "catalogue grid", :type => :feature, js: true do
  before do
    visit "/catalogue/"
  end

  it "has 60 catalogue items on page", :driver => :selenium do
    page.should have_selector(".card", :count => 60)
    page.select "Taranto region", :from => "Location"
    page.should have_selector(".card", :count => 37)
    page.click_button "Clear Filters"
    page.should have_selector(".card", :count => 60)
  end

end
