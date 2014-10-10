Rails.application.routes.draw do
  devise_for :users
  get 'welcome/index'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'

  resources :outings do
  	member do
  		resources :activities, only: [:index]
  	end 
  end 

  resources :activities, except: [:index] 

  resources :users, only: [:show]

  post '/new_email' => 'users#new_email'

end
