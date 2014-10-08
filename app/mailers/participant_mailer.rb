class ParticipantMailer < ActionMailer::Base
  default from: "notifications@example.com"

	def send_email(participant, outing)
		@outing = outing
		@participant = participant
		# @url = 
		mail(to: @participant, subject: 'Would you like to join my outing?')
	end

end