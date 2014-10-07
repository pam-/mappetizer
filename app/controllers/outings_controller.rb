class OutingsController < ApplicationController

	before_action :authenticate_user!, except: [:show, :index]

	def index
	  @outings = Outing.order(:created_at)
	end

	def new
	  @outing = Outing.new
	end

	def show
	  @outing = Outing.find(params[:id])
	end

	def edit
	  @outing = Outing.find(params[:id])
	end

	def create
	  @outing = Outing.new(outing_params.merge(user_id: current_user.id))
	  if @outing.save
	    redirect_to @outing
	  else
	    render :new
	  end
	end

	def destroy
	  @outing = Outing.find(params[:id])
	  @outing.destroy
	  redirect_to outings_url
	end

	private

	def outing_params
	  params.require(:outing).permit(:name, :date, :city)
	end	

end