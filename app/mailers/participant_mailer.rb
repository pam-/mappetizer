class ParticipantMailer < ActionMailer::Base
  default from: "notifications@example.com"

	def send_email(participants, outing_link, user)
		@user = user
		@outing_link = outing_link
		@participants = participants
		@participants.each do |participant|
			mail(to: participant, subject: 'Would you like to join my outing?')
		end 
	end

end