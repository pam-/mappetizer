class Outing < ActiveRecord::Base
	belongs_to :user
	has_and belongs_to_many :activities
end