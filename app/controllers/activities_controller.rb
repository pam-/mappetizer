class ActivitiesController < ApplicationController
	before_action :authenticate_user!, except: [:show, :index]

	def create
		@outing = Collection.find(params[:outing_id])
		@activity = @outing.activities.create(activity_params)
	  redirect_to outing_path(@outing)
	end

	def destroy
		@outing = Collection.find(params[:outing_id])
		@activity = @outing.activities.find(params[:id])
		@activity.destroy
		redirect_to outing_path(@outing)
	end

	private

	def activity_params
		params.require(:activity).permit(:name, :category, :event_id, :event_url) 
	end

end