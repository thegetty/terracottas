require "spec_helper"

describe "index", :type => :feature do
  before do
    visit "/"
  end

  it "has the correct title" do
    page.should have_selector "h1"
    within "h1" do
      page.should have_content /Ancient Terracottas from South Italy and Sicily/i
    end
  end
end
