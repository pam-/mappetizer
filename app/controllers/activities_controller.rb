class ActivitiesController < ApplicationController
	before_action :authenticate_user!, except: [:show, :index]

	def create
		@outing = Outing.last
		@activity = @outing.activities.create(activity_params)
		if @activity.save
			respond_to do |format|
				format.html { redirect_to outings_path }
				format.json { render json: @outing }
			end 
		else 
			respond_to do |format|
				format.html { render :new }
				format.json { render status: 404 }
			end 
		end
	end

	def show
		@activity = Activity.find(params[:id])
		respond_to do |format|
			format.html
			format.json { render json: @activity }
		end 
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