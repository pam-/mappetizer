class UsersController < ApplicationController

	def show
	  @user = User.find(params[:id])	
	  @outings = Outing.where(:user_id => @user.id)
	end

	def new_mail
		@user = current_user
		@participants = params[:participants]
		@outing_link = params[:url]
		begin
			ParticipantMailer.send_mail(@participants, @outing_link, @user).deliver
		end 
	end

end