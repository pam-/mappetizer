class AddCoordinatesToActivity < ActiveRecord::Migration
  def change
  	add_column :activities, :longitude, :string
  	add_column :activities, :latitude, :string
  end
end
