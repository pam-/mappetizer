class UsersController < ApplicationController

	def show
	  @user = User.find(params[:id])	
	  @outings = Outing.where(:user_id => @user.id)
	end

end