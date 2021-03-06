class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :name
      t.string :category
      t.integer :event_id, :limit => 8
      t.string :event_url
      t.string :latitude
      t.string :longitude
    end
  end
end
