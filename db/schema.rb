# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141007145622) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: true do |t|
    t.string  "name"
    t.string  "category"
    t.integer "event_id",  limit: 8
    t.string  "event_url"
    t.string  "latitude"
    t.string  "longitude"
  end

  create_table "activities_outings", id: false, force: true do |t|
    t.integer "activity_id", null: false
    t.integer "outing_id",   null: false
  end

  add_index "activities_outings", ["activity_id", "outing_id"], name: "index_activities_outings_on_activity_id_and_outing_id", using: :btree
  add_index "activities_outings", ["outing_id", "activity_id"], name: "index_activities_outings_on_outing_id_and_activity_id", using: :btree

  create_table "outings", force: true do |t|
    t.string  "name"
    t.string  "date"
    t.string  "city"
    t.integer "user_id"
  end

  add_index "outings", ["user_id"], name: "index_outings_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
