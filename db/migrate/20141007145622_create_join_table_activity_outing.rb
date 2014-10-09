class CreateJoinTableActivityOuting < ActiveRecord::Migration
  def change
    create_join_table :activities, :outings do |t|
      t.index [:activity_id, :outing_id]
      t.index [:outing_id, :activity_id]
    end
  end
end
