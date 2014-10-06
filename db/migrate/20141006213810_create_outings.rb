class CreateOutings < ActiveRecord::Migration
  def change
    create_table :outings do |t|
      t.string :name
      t.string :date
      t.string :city
      t.references :user, index: true
    end
  end
end
