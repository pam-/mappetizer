class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :name
      t.integer :category
      t.integer :event_id
      t.string :event_url
      t.references :outing, index: true
    end
  end
end
