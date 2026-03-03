import React, { useState, useEffect, useRef } from 'react';
import { Bus, Map as MapIcon, Users, Clock, Search, MapPin, AlertCircle, Info, ArrowRight, ArrowDownUp, ChevronLeft, RefreshCw, Navigation, UserMinus, Lightbulb, Activity, Home, List, Globe, CalendarDays, Route, MapPinOff, Coins, Zap, ShieldAlert, Sparkles, Menu, X, Code } from 'lucide-react';
import { supabase } from './supabaseClient';

// --- TRANSLATIONS DICTIONARY ---
const translations = {
  en: {
    home: "Home",
    planner: "Bus Finder",
    multi_planner: "Multi-Leg Planner",
    routes_dir: "Routes Directory",
    route_schedule: "Route Schedule",
    find_bus: "Track Live Buses",
    search_placeholder: "Enter Route or Stop Name...",
    tracking_info: "Tracking {b} active buses across {s} major stops.",
    system_indicators: "System Indicators",
    updating_buffer: "Updating Buffer:",
    passenger_counts_est: "Passenger counts estimating (2-3 min delay).",
    confirmed_seats: "Confirmed Seats:",
    ticket_buffer_cleared: "Ticket buffer cleared, accurate seat count available.",
    map_view: "Map View",
    list_view: "List View",
    on_board: "On Board",
    cap: "cap",
    pass_holders: "Pass Holders",
    search_from_to: "Where are you going?",
    from: "Departure",
    to: "Destination",
    location: "Search stop...",
    service_type: "Service Category",
    all_services: "All Services",
    search_bus: "Find Direct Buses",
    search_multi: "Discover Journey Routes",
    recent_history: "Recent Searches",
    all_upcoming: "Direct Bus Availabilities",
    results_found: "Results",
    no_routes: "No Results Found",
    transfer_suggestion: "Direct tracking is unavailable for this route. Please switch to the Multi-Leg Planner to discover connecting routes, then use this Bus Finder to track each leg individually.",
    planner_info: "Route Discovery Tool: This planner helps you figure out which buses to take. To track the live status and occupancy of these buses, please search for them directly in the Bus Finder.",
    bus_details: "Bus Details",
    route_timeline: "Route Timeline",
    seat_status: "Seat Status",
    live_status: "Live Status",
    bus_info: "Bus Info",
    pull_up: "Pull Up to view more",
    bus_left: "Bus Left",
    arriving: "Arriving...",
    expected_depart: "Expected Passengers Deboarding:",
    live_crowd: "Live Crowd Status",
    full: "Full",
    seating_cap: "Seating Capacity",
    passengers_on_board: "Passengers On Board",
    duration: "Duration",
    date_trip: "Date of Trip",
    today_live: "Today, Live",
    depot_name: "Depot Name",
    origin: "Origin",
    destination: "Destination",
    driver_name: "Driver Name",
    helpline: "Helpline",
    scheduled_start: "Scheduled Start",
    time_slot: "Time Slot",
    expected_crowd: "Expected Crowd",
    stops: "Stops",
    twd: "twd",
    route_path: "Route Path",
    hours: "Hours",
    no_match: "No buses found matching",
    schedule_title: "Bus Schedule (8:00 AM – 8:00 PM)",
    bus_no: "Bus No",
    start_time: "Start Time",
    developers_corner: "Developer's Corner",
    good_board: "Good to Board",
    good_board_desc: "Seats are currently available. You will likely get a seat without issue.",
    overcrowded: "Overcrowded (Standing Only)",
    overcrowded_desc: "This bus is operating at full capacity. Expect to stand. Consider waiting for the next bus if you are travelling far.",
    hold_on: "Hold On, Seats Opening",
    hold_on_desc: "Bus is nearly full, but passengers are expected to deboard at the very next stop.",
    almost_full: "Almost Full",
    almost_full_desc: "Seats are filling up fast. You may need to share a seat or stand for a short while before someone deboards.",
    loading_map: "Loading Map Engine...",
    mrng_peak: "Morning Peak",
    normal: "Normal",
    eve_buildup: "Eve Build-up",
    eve_peak: "Eve Peak",
    night: "Night",
    high: "HIGH",
    med_high: "MED-HIGH",
    medium: "MEDIUM",
    low: "LOW",
    boarding: "Boarding",
    running: "Running",
    updating: "Updating...",
    sec: "s",
    route_505: "Route 505",
    next: "Next",
    at_stop: "At Stop",
    live_bus_status: "Live Bus Status",
    current_bus: "Current Bus:",
    start_time_label: "Start Time:",
    simulation_time: "Simulation Time:",
    current_stop: "Current Stop:",
    ticket_status: "Ticket Status:",
    tickets_issued: "Tickets Issued:",
    estimated_pass_holders: "Estimated Pass Holders:",
    total_occupancy: "Total Occupancy:",
    seats_available: "Seats Available:",
    seats_available_est: "seats available (Estimated)",
    confirmed: "Confirmed",
    upcoming_stops_title: "Upcoming Stops (Expected Time + Departuring)",
    expected_deboarding_list: "Expected Passengers Deboarding:",
    no_upcoming_stops: "No more upcoming stops.",
    transfers_required: "Transfers Required",
    open_multi_leg_planner: "Open Multi-Leg Planner",
    discover_routes: "Discover Routes",
    find_bus_btn: "Find Bus",
    syncing_sensors: "SYNCING SENSORS...",
    routes_dir_desc: "Explore our comprehensive network of bus routes. Find the exact path and sequence of stops for every active service across the city.",
    active_routes: "Active Routes",
    depot_tag: "DEPOT",
    available_journey_options: "Available Journey Options",
    mins: "mins",
    stops_count: "stops",
    eta_text: "ETA:",
    arrival_text: "Arrival:",
    type_label: "Type:",
    next_stop_label: "Next Stop:",
    available_seats_label: "Available Seats:",
    tip_budget: "💰 Most Economical Path",
    tip_fast: "⚡ Ultra-Fast Direct Link",
    tip_scenic: "🐢 Longer Route (Traffic Prone)",
    tip_direct: "🎯 Convenient Direct Commute",
    tip_quick_transfer: "🏃 Quick Seamless Transfer",
    tip_multi: "🗺️ Explorer Route (Multiple Stops)",
    tip_f1: "✨ Balanced & Standard Route",
    tip_f2: "🌟 Popular Commuter Choice",
    tip_f3: "🛡️ Reliable Daily Connection",
    tip_f4: "🚦 Avoids Major Bottlenecks",
    tip_f5: "🧭 Alternative Journey Option",
    tip_f6: "🎟️ Frequent Service Corridor"
  },
  hi: {
    home: "होम",
    planner: "बस फाइंडर",
    multi_planner: "मल्टी-लेग प्लानर",
    routes_dir: "रूट्स डायरेक्टरी",
    route_schedule: "रूट अनुसूची",
    find_bus: "लाइव बसें ट्रैक करें",
    search_placeholder: "रूट या स्टॉप का नाम दर्ज करें...",
    tracking_info: "{s} प्रमुख स्टॉप पर {b} सक्रिय बसों को ट्रैक कर रहा है।",
    system_indicators: "सिस्टम संकेतक",
    updating_buffer: "बफर अपडेट:",
    passenger_counts_est: "यात्री संख्या का अनुमान (2-3 मिनट की देरी)।",
    confirmed_seats: "कन्फर्म सीटें:",
    ticket_buffer_cleared: "टिकट बफर साफ, सटीक सीट गणना उपलब्ध।",
    map_view: "मैप व्यू",
    list_view: "लिस्ट व्यू",
    on_board: "सवार यात्री",
    cap: "क्षमता",
    pass_holders: "पास धारक",
    search_from_to: "आप कहाँ जा रहे हैं?",
    from: "प्रस्थान",
    to: "गंतव्य",
    location: "स्टॉप खोजें...",
    service_type: "सेवा श्रेणी",
    all_services: "सभी सेवाएं",
    search_bus: "सीधी बसें खोजें",
    search_multi: "यात्रा मार्ग खोजें",
    recent_history: "हाल की खोजें",
    all_upcoming: "सीधी बस उपलब्धता",
    results_found: "परिणाम",
    no_routes: "कोई परिणाम नहीं मिला",
    transfer_suggestion: "इस मार्ग के लिए सीधी बस उपलब्ध नहीं है। कनेक्टिंग बसें देखने के लिए मल्टी-लेग प्लानर का उपयोग करें, फिर प्रत्येक लेग को ट्रैक करने के लिए बस फाइंडर का उपयोग करें।",
    planner_info: "मार्ग खोज उपकरण: यह प्लानर आपको यह जानने में मदद करता है कि कौन सी बसें लेनी हैं। लाइव स्थिति ट्रैक करने के लिए, उन्हें बस फाइंडर में खोजें।",
    bus_details: "बस विवरण",
    route_timeline: "रूट टाइमलाइन",
    seat_status: "सीट स्थिति",
    live_status: "लाइव स्थिति",
    bus_info: "बस जानकारी",
    pull_up: "अधिक देखने के लिए ऊपर खींचें",
    bus_left: "बस जा चुकी है",
    arriving: "आ रही है...",
    expected_depart: "उतरने वाले यात्री:",
    live_crowd: "लाइव भीड़ स्थिति",
    full: "भरा हुआ",
    seating_cap: "बैठने की क्षमता",
    passengers_on_board: "बोर्ड पर यात्री",
    duration: "अवधि",
    date_trip: "यात्रा की तिथि",
    today_live: "आज, लाइव",
    depot_name: "डिपो का नाम",
    origin: "मूल",
    destination: "गंतव्य",
    driver_name: "ड्राइवर का नाम",
    helpline: "हेल्पलाइन",
    scheduled_start: "निर्धारित शुरुआत",
    time_slot: "समय स्लॉट",
    expected_crowd: "अपेक्षित भीड़",
    stops: "स्टॉप",
    twd: "की ओर",
    route_path: "रूट पथ",
    hours: "घंटे",
    no_match: "कोई बस नहीं मिली जो मेल खाती हो",
    schedule_title: "बस अनुसूची (8:00 AM – 8:00 PM)",
    bus_no: "बस नंबर",
    start_time: "प्रारंभ समय",
    developers_corner: "Developer's Corner",
    good_board: "बोर्ड करने के लिए अच्छा है",
    good_board_desc: "सीटें वर्तमान में उपलब्ध हैं। आपको बिना किसी समस्या के सीट मिल जाएगी।",
    overcrowded: "अत्यधिक भीड़ (केवल खड़े होने के लिए)",
    overcrowded_desc: "यह बस पूरी क्षमता पर चल रही है। खड़े होने की अपेक्षा करें।",
    hold_on: "रुकें, सीटें खुल रही हैं",
    hold_on_desc: "बस लगभग भरी हुई है, लेकिन अगले स्टॉप पर यात्रियों के उतरने की उम्मीद है।",
    almost_full: "लगभग भरा हुआ",
    almost_full_desc: "सीटें तेजी से भर रही हैं। आपको किसी के उतरने तक थोड़ी देर खड़ा रहना पड़ सकता है।",
    loading_map: "मैप इंजन लोड हो रहा है...",
    mrng_peak: "सुबह (पीक)",
    normal: "सामान्य",
    eve_buildup: "शाम (शुरुआत)",
    eve_peak: "शाम (पीक)",
    night: "रात",
    high: "अधिक",
    med_high: "मध्यम-अधिक",
    medium: "मध्यम",
    low: "कम",
    boarding: "बोर्डिंग",
    running: "चल रही है",
    updating: "अपडेट हो रहा है...",
    sec: "से.",
    route_505: "रूट 505",
    next: "अगला",
    at_stop: "स्टॉप पर",
    live_bus_status: "लाइव बस स्थिति",
    current_bus: "वर्तमान बस:",
    start_time_label: "प्रारंभ समय:",
    simulation_time: "सिमुलेशन समय:",
    current_stop: "वर्तमान स्टॉप:",
    ticket_status: "टिकट स्थिति:",
    tickets_issued: "जारी किए गए टिकट:",
    estimated_pass_holders: "अनुमानित पास धारक:",
    total_occupancy: "कुल यात्री:",
    seats_available: "उपलब्ध सीटें:",
    seats_available_est: "सीटें उपलब्ध हैं (अनुमानित)",
    confirmed: "कन्फर्म",
    upcoming_stops_title: "आने वाले स्टॉप (अपेक्षित समय + उतरने वाले यात्री)",
    expected_deboarding_list: "उतरने वाले अनुमानित यात्री:",
    no_upcoming_stops: "आगे कोई स्टॉप नहीं है।",
    transfers_required: "ट्रांसफर आवश्यक है",
    open_multi_leg_planner: "मल्टी-लेग प्लानर खोलें",
    discover_routes: "मार्ग खोजें",
    find_bus_btn: "बस खोजें",
    syncing_sensors: "सेंसर सिंक हो रहे हैं...",
    routes_dir_desc: "हमारे बस मार्गों के व्यापक नेटवर्क का अन्वेषण करें। शहर भर में हर सक्रिय सेवा के लिए सटीक पथ और स्टॉप का क्रम खोजें।",
    active_routes: "सक्रिय मार्ग",
    depot_tag: "डिपो",
    available_journey_options: "उपलब्ध यात्रा विकल्प",
    mins: "मिनट",
    stops_count: "स्टॉप",
    eta_text: "ईटीए (ETA):",
    arrival_text: "आगमन:",
    type_label: "प्रकार:",
    next_stop_label: "अगला स्टॉप:",
    available_seats_label: "उपलब्ध सीटें:",
    tip_budget: "💰 सबसे किफायती मार्ग",
    tip_fast: "⚡ अल्ट्रा-फास्ट सीधा लिंक",
    tip_scenic: "🐢 लंबा मार्ग (यातायात संभावित)",
    tip_direct: "🎯 सुविधाजनक सीधा आवागमन",
    tip_quick_transfer: "🏃 त्वरित और सहज ट्रांसफर",
    tip_multi: "🗺️ एक्सप्लोरर मार्ग (कई स्टॉप)",
    tip_f1: "✨ संतुलित और मानक मार्ग",
    tip_f2: "🌟 लोकप्रिय यात्री विकल्प",
    tip_f3: "🛡️ विश्वसनीय दैनिक कनेक्शन",
    tip_f4: "🚦 प्रमुख भीड़भाड़ से बचाता है",
    tip_f5: "🧭 वैकल्पिक यात्रा विकल्प",
    tip_f6: "🎟️ लगातार सेवा कॉरिडोर"
  },
  te: {
    home: "హోమ్",
    planner: "బస్సు ఫైండర్",
    multi_planner: "మल्टी-లెగ్ ప్లానర్",
    routes_dir: "మార్గాల డైరెక్టరీ",
    route_schedule: "మార్గం షెడ్యూల్",
    find_bus: "లైవ్ బస్సులను ట్రాక్ చేయండి",
    search_placeholder: "రూట్ లేదా స్టాప్ పేరును నమోదు చేయండి...",
    tracking_info: "{s} ప్రధాన స్టాప్‌లలో {b} క్రియాశీల బస్సులను ట్రాక్ చేస్తోంది.",
    system_indicators: "సిస్టమ్ సూచికలు",
    updating_buffer: "బఫర్ నవీకరణ:",
    passenger_counts_est: "ప్రయాణీకుల సంఖ్య అంచనా (2-3 నిమిషాల ఆలస్యం).",
    confirmed_seats: "ధృవీకరించబడిన సీట్లు:",
    ticket_buffer_cleared: "టిక్కెట్ బఫర్ క్లియర్ చేయబడింది, కచ్చితమైన సీట్ల సంఖ్య అందుబాటులో ఉంది.",
    map_view: "మ్యాప్ వ్యూ",
    list_view: "లిస్ట్ వ్యూ",
    on_board: "బస్సులో",
    cap: "సామర్థ్యం",
    pass_holders: "పాస్ దారులు",
    search_from_to: "మీరు ఎక్కడికి వెళ్తున్నారు?",
    from: "బయలుదేరే స్థానం",
    to: "గమ్యం",
    location: "స్టాప్ వెతకండి...",
    service_type: "సేవా రకం",
    all_services: "అన్ని సేవలు",
    search_bus: "నేరుగా బస్సులను కనుగొనండి",
    search_multi: "ప్రయాణ మార్గాలను కనుగొనండి",
    recent_history: "ఇటీవలి శోధనలు",
    all_upcoming: "నేరుగా బస్సు లభ్యత",
    results_found: "ఫలితాలు",
    no_routes: "ఫలితాలు కనుగొనబడలేదు",
    transfer_suggestion: "ఈ మార్గానికి నేరుగా బస్సులు అందుబాటులో లేవు. కనెక్టింగ్ మార్గాలను కనుగొనడానికి మల్టీ-లెగ్ ప్లానర్‌ని ఉపయోగించండి, ఆపై ఒక్కో బస్సును ట్రాక్ చేయడానికి బస్సు ఫైండర్‌ను ఉపయోగించండి.",
    planner_info: "రూట్ డిస్కవరీ టూల్: ఏ బస్సులు ఎక్కాలో తెలుసుకోవడానికి ఇది సహాయపడుతుంది. వాటి లైవ్ స్థితిని తెలుసుకోవడానికి బస్సు ఫైండర్‌ని ఉపయోగించండి.",
    bus_details: "బస్సు వివరాలు",
    route_timeline: "మార్గం టైమ్‌లైన్",
    seat_status: "సీటు స్థితి",
    live_status: "లైవ్ స్థితి",
    bus_info: "బస్సు సమాచారం",
    pull_up: "మరింత చూడటానికి పైకి లాగండి",
    bus_left: "బస్సు వెళ్లిపోయింది",
    arriving: "వస్తోంది...",
    expected_depart: "దిగుతున్న ప్రయాణికులు:",
    live_crowd: "లైవ్ రద్దీ స్థితి",
    full: "నిండింది",
    seating_cap: "సీటింగ్ సామర్థ్యం",
    passengers_on_board: "ప్రయాణికులు",
    duration: "వ్యవధి",
    date_trip: "ప్రయాణ తేదీ",
    today_live: "నేడు, లైవ్",
    depot_name: "డిపో పేరు",
    origin: "మూలం",
    destination: "గమ్యం",
    driver_name: "డ్రైవర్ పేరు",
    helpline: "హెల్ప్‌లైన్",
    scheduled_start: "ప్రారంభ సమయం",
    time_slot: "సమయం స్లాట్",
    expected_crowd: "ఊహించిన రద్దీ",
    stops: "స్టాప్‌లు",
    twd: "వైపు",
    route_path: "మార్గం",
    hours: "గంటలు",
    no_match: "సరిపోలే బస్సులు కనుగొనబడలేదు",
    schedule_title: "బస్సు షెడ్యూల్ (8:00 AM – 8:00 PM)",
    bus_no: "బస్సు నంబర్",
    start_time: "ప్రారంభ సమయం",
    developers_corner: "Developer's Corner",
    good_board: "ఎక్కడానికి అనుకూలం",
    good_board_desc: "ప్రస్తుతం సీట్లు అందుబాటులో ఉన్నాయి. మీకు ఎలాంటి ఇబ్బంది లేకుండా సీటు దొరుకుతుంది.",
    overcrowded: "అత్యధిక రద్దీ (నిలబడటానికి మాత్రమే)",
    overcrowded_desc: "ఈ బస్సు పూర్తి సామర్థ్యంతో నడుస్తోంది. నిలబడాల్సి ఉంటుంది.",
    hold_on: "ఆగండి, సీట్లు ఖాళీ అవుతున్నాయి",
    hold_on_desc: "బస్సు దాదాపు నిండిపోయింది, కానీ తదుపరి స్టాప్‌లో ప్రయాణికులు దిగే అవకాశం ఉంది.",
    almost_full: "దాదాపు నిండింది",
    almost_full_desc: "సీట్లు వేగంగా నిండుతున్నాయి. ఎవరైనా దిగే వరకు మీరు కొద్దిసేపు నిలబడాల్సి రావచ్చు.",
    loading_map: "మ్యాప్ ఇంజిన్ లోడ్ అవుతోంది...",
    mrng_peak: "ఉదయం (రద్దీ)",
    normal: "సాధారణ",
    eve_buildup: "సాయంత్రం (ప్రారంభం)",
    eve_peak: "సాయంత్రం (రద్దీ)",
    night: "రాత్రి",
    high: "ఎక్కువ",
    med_high: "మధ్యస్థ-ఎక్కువ",
    medium: "మధ్యస్థ",
    low: "తక్కువ",
    boarding: "ఎక్కుతున్నారు",
    running: "నడుస్తోంది",
    updating: "నవీకరిస్తోంది...",
    sec: "సె.",
    route_505: "రూట్ 505",
    next: "తదుపరి",
    at_stop: "స్టాప్‌లో",
    live_bus_status: "లైవ్ బస్సు స్థితి",
    current_bus: "ప్రస్తుత బస్సు:",
    start_time_label: "ప్రారంభ సమయం:",
    simulation_time: "సిమ్యులేషన్ సమయం:",
    current_stop: "ప్రస్తుత స్టాప్:",
    ticket_status: "టికెట్ స్థితి:",
    tickets_issued: "జారీ చేసిన టిక్కెట్లు:",
    estimated_pass_holders: "అంచనా వేసిన పాస్ దారులు:",
    total_occupancy: "మొత్తం ప్రయాణికులు:",
    seats_available: "అందుబాటులో ఉన్న సీట్లు:",
    seats_available_est: "సీట్లు అందుబాటులో ఉన్నాయి (అంచనా)",
    confirmed: "నిర్ధారించబడింది",
    upcoming_stops_title: "రాబోయే స్టాప్‌లు (ఊహించిన సమయం + దిగే ప్రయాణికులు)",
    expected_deboarding_list: "దిగుతారని ఊహించిన ప్రయాణికులు:",
    no_upcoming_stops: "ఇక రాబోయే స్టాప్‌లు లేవు.",
    transfers_required: "ట్రాన్స్‌ఫర్ అవసరం",
    open_multi_leg_planner: "మల్టీ-లెగ్ ప్లానర్ తెరవండి",
    discover_routes: "మార్గాలను కనుగొనండి",
    find_bus_btn: "బస్సును కనుగొనండి",
    syncing_sensors: "సెన్సార్లు సమకాలీకరించబడుతున్నాయి...",
    routes_dir_desc: "మా బస్సు మార్గాల సమగ్ర నెట్‌వర్క్‌ను అన్వేషించండి. నగరం అంతటా ప్రతి క్రియాశీల సేవ కోసం ఖచ్చితమైన మార్గం మరియు స్టాప్‌ల క్రమాన్ని కనుగొనండి.",
    active_routes: "క్రియాశీల మార్గాలు",
    depot_tag: "డిపో",
    available_journey_options: "అందుబాటులో ఉన్న ప్రయాణ ఎంపికలు",
    mins: "నిమిషాలు",
    stops_count: "స్టాప్‌లు",
    eta_text: "అంచనా సమయం:",
    arrival_text: "రాక:",
    type_label: "రకం:",
    next_stop_label: "తదుపరి స్టాప్:",
    available_seats_label: "అందుబాటులో ఉన్న సీట్లు:",
    tip_budget: "💰 అత్యంత ఆర్థిక మార్గం",
    tip_fast: "⚡ అతి-వేగవంతమైన డైరెక్ట్ లింక్",
    tip_scenic: "🐢 పొడవైన మార్గం (ట్రాఫిక్ ఉండే అవకాశం)",
    tip_direct: "🎯 అనుకూలమైన ప్రత్యక్ష ప్రయాణం",
    tip_quick_transfer: "🏃 వేగవంతమైన & అతుకులు లేని బదిలీ",
    tip_multi: "🗺️ ఎక్స్‌ప్లోరర్ మార్గం (బహుళ స్టాప్‌లు)",
    tip_f1: "✨ సమతుల్య & ప్రామాణిక మార్గం",
    tip_f2: "🌟 ప్రయాణికుల ప్రసిద్ధ ఎంపిక",
    tip_f3: "🛡️ నమ్మకమైన రోజువారీ కనెక్షన్",
    tip_f4: "🚦 ప్రధాన ట్రాఫిక్‌ను నివారిస్తుంది",
    tip_f5: "🧭 ప్రత్యామ్నాయ ప్రయాణ ఎంపిక",
    tip_f6: "🎟️ తరచుగా ఉండే సేవా కారిడార్"
  }
};

// --- STOP NAMES TRANSLATIONS ---
const locTranslations = {
  "Secunderabad": { hi: "सिकंदराबाद", te: "సికింద్రాబాద్" },
  "Paradise": { hi: "पैराडाइज", te: "ప్యారడైజ్" },
  "JBS": { hi: "जेबीएस", te: "జె.బి.ఎస్" },
  "Alwal": { hi: "अलवाल", te: "అల్వాల్" },
  "Bolarum": { hi: "बोलारम", te: "బొల్లారం" },
  "Musheerabad": { hi: "मुशीराबाद", te: "ముషీరాబాద్" },
  "RTC X Roads": { hi: "आरटीसी एक्स रोड्स", te: "ఆర్టీసీ ఎక్స్ రోడ్స్" },
  "Tank Bund": { hi: "टैंक बंड", te: "ట్యాంక్ బండ్" },
  "Secretariat": { hi: "सचिवालय", te: "సెక్రటేరియట్" },
  "Abids": { hi: "एबिड्स", te: "అబిడ్స్" },
  "Nampally": { hi: "नामपल्ली", te: "నాంపల్లి" },
  "Lakdikapul": { hi: "लकड़ीकापुल", te: "లక్డీకాపూల్" },
  "Koti": { hi: "कोटी", te: "కోటి" },
  "Himayath Nagar": { hi: "हिमायत नगर", te: "హిమాయత్ నగర్" },
  "Ashok Nagar": { hi: "अशोक नगर", te: "అశోక్ నగర్" },
  "Domalguda": { hi: "दोमलगुडा", te: "దోమలగూడ" },
  "Liberty": { hi: "लिबर्टी", te: "లిబర్టీ" },
  "Basheerbagh": { hi: "बशीरबाग", te: "బషీర్‌బాగ్" },
  "Nizam College": { hi: "निजाम कॉलेज", te: "నిజాం కాలేజ్" },
  "Assembly": { hi: "असेंबली", te: "అసెంబ్లీ" },
  "Bata": { hi: "बाटा", te: "బాటా" },
  "Kavadiguda": { hi: "कवाडिगुडा", te: "కవాడిగూడ" },
  "Amberpet": { hi: "अंबरपेट", te: "అంబర్‌పేట్" },
  "Banjara Hills": { hi: "बंजारा हिल्स", te: "బంజారా హిల్స్" },
  "LV Prasad Eye Hospital": { hi: "एलवी प्रसाद आई हॉस्पिटल", te: "ఎల్.వి. ప్రసాద్ ఐ హాస్పిటల్" },
  "Jubilee Hills Check Post": { hi: "जुबली हिल्स चेक पोस्ट", te: "జూబ్లీ హిల్స్ చెక్ పోస్ట్" },
  "Peddamma Temple": { hi: "पेद्दम्मा टेम्पल", te: "పెద్దమ్మ టెంపుల్" },
  "Madhapur": { hi: "माधापुर", te: "మాదాపూర్" },
  "Raidurg": { hi: "रायदुर्ग", te: "రాయదుర్గం" },
  "Ameerpet X Roads": { hi: "अमीरपेट एक्स रोड्स", te: "అమీర్‌పేట్ ఎక్స్ రోడ్స్" },
  "Panjagutta": { hi: "पंजागुट्टा", te: "పంజగుట్ట" },
  "Khairatabad": { hi: "खैरताबाद", te: "ఖైరతాబాద్" },
  "SR Nagar": { hi: "एसआर नगर", te: "ఎస్.ఆర్ నగర్" },
  "Erragadda": { hi: "एरागाड्डा", te: "ఎర్రగడ్డ" },
  "ESI": { hi: "ईएसआई", te: "ఈ.ఎస్.ఐ" },
  "Sanath Nagar": { hi: "सनत नगर", te: "సనత్ నగర్" },
  "Moosapet": { hi: "मूसापेट", te: "మూసాపేట్" },
  "Balanagar": { hi: "बालानगर", te: "బాలానగర్" },
  "Jeedimetla": { hi: "जीदीमेटला", te: "జీడిమెట్ల" },
  "Kukatpally": { hi: "कुकटपल्ली", te: "కూకట్‌పల్లి" },
  "KPHB Colony": { hi: "केपीएचबी कॉलोनी", te: "కె.పి.హెచ్.బి కాలనీ" },
  "JNTU": { hi: "जेएनटीयू", te: "జె.ఎన్.టి.యు" },
  "Miyapur": { hi: "मियापुर", te: "మియాపూర్" },
  "Miyapur Metro": { hi: "मियापुर मेट्रो", te: "మియాపూర్ మెట్రో" },
  "Miyapur X Roads": { hi: "मियापुर एक्स रोड्स", te: "మియాపూర్ ఎక్స్ రోడ్స్" },
  "Lingampally": { hi: "लिंगमपल्ली", te: "లింగంపల్లి" },
  "Chandanagar": { hi: "चंदा नगर", te: "చందానగర్" },
  "BHEL": { hi: "भेल (BHEL)", te: "బి.హెచ్.ఇ.ఎల్" },
  "RC Puram": { hi: "आरसी पुरम", te: "ఆర్.సి పురం" },
  "Beeramguda": { hi: "बीरमगुडा", te: "బీరంగూడ" },
  "Patancheru": { hi: "पाटनचेरु", te: "పటాన్‌చెరు" },
  "Kondapur": { hi: "कोंडापुर", te: "కొండాపూర్" },
  "Hitec City": { hi: "हाईटेक सिटी", te: "హైటెక్ సిటీ" },
  "Gachibowli": { hi: "गाचीबाउली", te: "గచ్చిబౌలి" },
  "Mehdipatnam": { hi: "मेहदीपट्टनम", te: "మెహదీపట్నం" },
  "Masab Tank": { hi: "मासाब टैंक", te: "మాసబ్ ట్యాంక్" },
  "Tolichowki": { hi: "टोलीचौकी", te: "టోలిచౌకి" },
  "Langar Houz": { hi: "लंगर हौज़", te: "లంగర్ హౌజ్" },
  "Golconda Fort": { hi: "गोलकोंडा फोर्ट", te: "గోల్కొండ ఫోర్ట్" },
  "Golconda": { hi: "गोलकोंडा", te: "గోల్కొండ" },
  "Afzalgunj": { hi: "अफजलगंज", te: "అఫ్జల్‌గంజ్" },
  "Charminar": { hi: "चारमीनार", te: "చార్మినార్" },
  "Falaknuma": { hi: "फलकनुमा", te: "ఫలక్‌నుమా" },
  "Chandrayangutta": { hi: "चंद्रयानगुट्टा", te: "చాంద్రాయణగుట్ట" },
  "Zoo Park": { hi: "ज़ू पार्क", te: "జూ పార్క్" },
  "Bahadurpura": { hi: "बहादुरपुरा", te: "బహదూర్‌పురా" },
  "Puranapool": { hi: "पुरानापुल", te: "పురానాపూల్" },
  "Kachiguda": { hi: "काचीगुडा", te: "కాచిగూడ" },
  "Vidyanagar": { hi: "विद्यानगर", te: "విద్యానగర్" },
  "Osmania University": { hi: "उस्मानिया विश्वविद्यालय", te: "ఉస్మానియా యూనివర్సిటీ" },
  "Tarnaka": { hi: "तरनाका", te: "తార్నాక" },
  "Uppal": { hi: "उप्पल", te: "ఉప్పల్" },
  "Nagole": { hi: "नागोल", te: "నాగోల్" },
  "Ramanthapur": { hi: "रामनथपुर", te: "రామంతాపూర్" },
  "Chaderghat": { hi: "चादरघाट", te: "చాదర్‌ఘాట్" },
  "Malakpet": { hi: "मलकपेट", te: "మలక్‌పేట" },
  "Dilsukhnagar": { hi: "दिलसुखनगर", te: "దిల్‌సుఖ్‌నగర్" },
  "LB Nagar": { hi: "एलबी नगर", te: "ఎల్బీ నగర్" },
  "NGOs Colony": { hi: "एनजीओ कॉलोनी", te: "ఎన్జీఓ కాలనీ" },
  "Hayathnagar": { hi: "हयातनगर", te: "హయత్‌నగర్" },
  "ECIL X Road": { hi: "ईसीआईएल एक्स रोड", te: "ఈ.సి.ఐ.ఎల్ ఎక్స్ రోడ్" },
  "Moula Ali": { hi: "मौला अली", te: "మౌలాలి" },
  "Kushaiguda": { hi: "कुशाईगुड़ा", te: "కుషాయిగూడ" },
  "JNTUH Sulthanpur": { hi: "जेएनटीयूएच सुल्तानपुर", te: "జెఎన్టియుహెచ్ సుల్తాన్‌పూర్" },
  "Sultanpur": { hi: "सुल्तानपुर", te: "సుల్తాన్‌పూర్" },
  "Singoor X Road": { hi: "सिंगूर एक्स रोड", te: "సింగూర్ ఎక్స్ రోడ్" },
  "Hunnapur": { hi: "हुन्नापुर", te: "హున్నాపూర్" },
  "Shivampet Road": { hi: "शिवरामपेट रोड", te: "శివంపేట్ రోడ్" },
  "Fasalwadi": { hi: "फसलवाडी", te: "ఫసల్వాడి" },
  "MNR X Road": { hi: "एमएनआर एक्स रोड", te: "ఎం.ఎన్.ఆర్ ఎక్స్ రోడ్" },
  "Sangareddy Old Bus Station": { hi: "संगारेड्डी ओल्ड बस स्टेशन", te: "సంగారెడ్డి ఓల్డ్ బస్ స్టేషన్" },
  "Sangareddy Bus Station": { hi: "संगारेड्डी बस स्टेशन", te: "సంగారెడ్డి బస్ స్టేషన్" },
  "Sangareddy X Road": { hi: "संगारेड्डी एक्स रोड", te: "సంగారెడ్డి ఎక్స్ రోడ్" },
  "Sangareddy": { hi: "संगारेड्डी", te: "సంగారెడ్డి" },
  "Kandi": { hi: "कांडी", te: "కంది" },
  "IIT Campus": { hi: "आईआईटी कैंपस", te: "ఐ.ఐ.టి క్యాంపస్" },
  "Koulampet": { hi: "कौलमपेट", te: "కౌలంపేట్" },
  "Ganeshgadda": { hi: "गणेशगड्डा", te: "గణేష్‌గడ్డ" },
  "Rudraram": { hi: "रुद्रारम", te: "రుద్రారం" },
  "Lakdaram": { hi: "लकडारम", te: "లక్డారం" },
  "Isnapur": { hi: "इस्नापुर", te: "ఇస్నాపూర్" },
  "Muthangi": { hi: "मुथंगी", te: "ముత్తంగి" },
  "HCU": { hi: "एचसीयू", te: "హెచ్.సి.యు" },
  "Cantonment": { hi: "छावनी", te: "కంటోన్మెంట్" },
  "Medak": { hi: "मेडक", te: "మెదక్" }
};

const serviceTypes = ["ORDINARY", "EXPRESS", "METRO EXPRESS", "METRO DELUXE", "PALLEVELUGU", "A/C SERIES"];

// Helper Functions
const parseTime = (timeStr) => {
  if (!timeStr) return new Date();
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  if (hours === 12) hours = 0;
  if (modifier === 'PM') hours += 12;
  const d = new Date();
  d.setHours(hours, parseInt(minutes, 10), 0, 0);
  return d;
};

const formatTimeOffset = (timeStr, offsetMins) => {
  if (!timeStr) return "--:--";
  const d = parseTime(timeStr);
  d.setMinutes(d.getMinutes() + offsetMins);
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  let hours = d.getHours() % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${ampm}`;
};

const getDeparturingPassengers = (stopName) => {
    if (!stopName) return 0;
    if (stopName.includes("Sangareddy")) return (stopName.length % 6) + 5;
    if (stopName.includes("Kandi")) return (stopName.length % 4) + 3;
    if (stopName.includes("Sulthanpur")) return (stopName.length % 7) + 6;
    if (stopName.includes("IIT")) return (stopName.length % 4) + 2;
    return (stopName.length % 3) + 1;
};

const getBusNum = (routeStr) => routeStr ? routeStr.split(' - ')[0] : '';

// --- CUSTOM AUTOCOMPLETE COMPONENT ---
function AutocompleteInput({ value, onChange, placeholder, options, label, icon, tLoc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchStr, setSearchStr] = useState(value ? tLoc(value) : '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
        setSearchStr(value ? tLoc(value) : '');
    }
  }, [value, tLoc, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => {
      const translated = tLoc(opt).toLowerCase();
      const original = opt.toLowerCase();
      const q = searchStr.toLowerCase();
      return translated.includes(q) || original.includes(q);
  });

  return (
    <div className="flex-1 relative" ref={wrapperRef}>
      <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-black text-slate-500 mb-1 justify-center md:justify-start">
        {icon} {label}
      </label>
      <input 
        type="text" 
        className="w-full text-lg font-extrabold text-slate-800 placeholder:text-slate-300 outline-none bg-transparent text-center md:text-left"
        value={searchStr} 
        onChange={(e) => { setSearchStr(e.target.value); setIsOpen(true); }} 
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-[100%] mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 sm:max-h-60 overflow-y-auto">
          {filteredOptions.map(opt => (
            <li 
              key={opt} 
              className="px-5 py-3 hover:bg-blue-50 hover:text-[#2563eb] cursor-pointer text-sm font-bold text-slate-700 transition-colors border-b border-slate-50 last:border-0 text-center md:text-left flex flex-col md:flex-row md:items-center gap-1"
              onClick={() => { onChange(opt); setSearchStr(tLoc(opt)); setIsOpen(false); }}
            >
              <span>{tLoc(opt)}</span>
              {tLoc(opt) !== opt && <span className="text-xs text-slate-400 font-medium md:ml-1">({opt})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- SINGLE BUS ROUTE MAP COMPONENT ---
function BusRouteMap({ bus, loadingText, tLoc }) {
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(!!window.L);

  useEffect(() => {
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setIsLeafletLoaded(true);
      document.head.appendChild(script);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    } else {
       setIsLeafletLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLeafletLoaded || !mapContainerRef.current) return;
    if (mapInstance.current) return;
    
    mapInstance.current = window.L.map(mapContainerRef.current, { zoomControl: false });
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM'
    }).addTo(mapInstance.current);

    const latlngs = bus.stops.map(s => [s.lat, s.lng]);
    window.L.polyline(latlngs, { color: '#3b82f6', weight: 4, opacity: 0.8 }).addTo(mapInstance.current);

    bus.stops.forEach(s => {
      window.L.circleMarker([s.lat, s.lng], {
        radius: 4, color: 'white', weight: 1, fillColor: '#2563eb', fillOpacity: 1
      }).addTo(mapInstance.current);
    });

    mapInstance.current.fitBounds(window.L.latLngBounds(latlngs), { padding: [40, 40] });
    setTimeout(() => { mapInstance.current?.invalidateSize() }, 300);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [bus.id, isLeafletLoaded]); 

  useEffect(() => {
    if (!window.L || !mapInstance.current || !bus.stops || bus.stops.length === 0) return;

    const currentStop = bus.stops[bus.currentStopIndex];
    const nextStop = bus.stops[(bus.currentStopIndex + 1) % bus.stops.length];
    let lat, lng;

    if (bus.bufferActive) {
      lat = currentStop.lat;
      lng = currentStop.lng;
    } else {
      const totalDriveTime = 20; 
      const progress = (totalDriveTime - bus.etaSeconds) / totalDriveTime;
      lat = currentStop.lat + (nextStop.lat - currentStop.lat) * progress;
      lng = currentStop.lng + (nextStop.lng - currentStop.lng) * progress;
    }

    const iconHtml = `
      <div style="background-color: #2563eb; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>
      </div>
    `;

    const icon = window.L.divIcon({ html: iconHtml, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setIcon(icon);
      markerRef.current.setTooltipContent(tLoc(currentStop.name));
    } else {
      markerRef.current = window.L.marker([lat, lng], { icon })
         .addTo(mapInstance.current)
         .bindTooltip(tLoc(currentStop.name), { permanent: true, direction: 'top', className: 'custom-bus-tooltip', offset: [0, -18] });
    }
  }, [bus, isLeafletLoaded, tLoc]);

  if (!isLeafletLoaded) {
      return (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500 font-bold">
               <RefreshCw className="w-6 h-6 animate-spin text-[#2563eb]" />
               {loadingText || "Loading Map Engine..."}
            </div>
        </div>
      );
  }

  return <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-0"></div>;
}

// --- OPENSTREETMAP COMPONENT (For Main Dashboard) ---
function MapComponent({ buses, tLoc, t, getTranslatedRouteDesc, translateBusType }) {
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    const initMap = () => {
      if (!window.L || !mapContainerRef.current) return;
      if (mapInstance.current) return;
      
      mapInstance.current = window.L.map(mapContainerRef.current).setView([17.4399, 78.4983], 12);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      setTimeout(() => { mapInstance.current?.invalidateSize() }, 300);
    }

    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    const handleResize = () => mapInstance.current?.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  useEffect(() => {
    if (!window.L || !mapInstance.current) return;

    buses.forEach(bus => {
      const currentStop = bus.stops[bus.currentStopIndex];
      const nextStop = bus.stops[(bus.currentStopIndex + 1) % bus.stops.length];
      let lat, lng;

      if (bus.bufferActive) {
        lat = currentStop.lat;
        lng = currentStop.lng;
      } else {
        const totalDriveTime = 20; 
        const progress = (totalDriveTime - bus.etaSeconds) / totalDriveTime;
        lat = currentStop.lat + (nextStop.lat - currentStop.lat) * progress;
        lng = currentStop.lng + (nextStop.lng - currentStop.lng) * progress;
      }

      const markerColor = bus.bufferActive ? '#f59e0b' : '#2563eb';
      const iconHtml = `
        <div style="background-color: ${markerColor}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
        </div>
      `;

      const icon = window.L.divIcon({ html: iconHtml, className: '', iconSize: [18, 18], iconAnchor: [9, 9] });
      const popupContent = `
        <div class="text-sm">
          <strong>${bus.route.split(' - ')[0]} - ${getTranslatedRouteDesc(bus.route)}</strong><br/>
          ${t('type_label')} ${translateBusType(bus.type)}<br/>
          ${t('next_stop_label')} ${tLoc(nextStop.name)}<br/>
          ${t('available_seats_label')} ${bus.totalSeats - bus.occupiedSeats}
        </div>
      `;

      if (markersRef.current[bus.id]) {
        markersRef.current[bus.id].setLatLng([lat, lng]);
        markersRef.current[bus.id].setIcon(icon);
        markersRef.current[bus.id].getPopup().setContent(popupContent);
      } else {
        markersRef.current[bus.id] = window.L.marker([lat, lng], { icon })
          .addTo(mapInstance.current)
          .bindPopup(popupContent);
      }
    });
  }, [buses, tLoc, t, getTranslatedRouteDesc, translateBusType]);

  return <div ref={mapContainerRef} className="w-full h-[400px] sm:h-[500px] lg:h-[calc(100vh-140px)] rounded-xl shadow-sm border border-slate-200 relative z-0"></div>;
}

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang]?.[key] || translations['en'][key] || key;
  
  const tLoc = (name) => {
    if (lang === 'en') return name;
    return locTranslations[name]?.[lang] || name;
  };

  const getTranslatedRouteDesc = (routeStr) => {
    if (!routeStr) return "";
    const desc = routeStr.split(' - ')[1]; 
    if (!desc) return routeStr;
    
    if (desc.includes(' to ')) {
      const [origin, dest] = desc.split(' to ');
      const tOrigin = tLoc(origin.trim());
      const tDest = tLoc(dest.trim());
      
      if (lang === 'hi') return `${tOrigin} से ${tDest}`;
      if (lang === 'te') return `${tOrigin} నుండి ${tDest}`;
      return `${tOrigin} to ${tDest}`;
    }
    return tLoc(desc);
  };

  // Precise Depot mapping logic ensures exact matches are passed to tLoc correctly
  const tDepot = (depotStr) => {
    if (!depotStr) return "";
    let cleanDepot = depotStr.replace(/ DEPOT$/i, '').trim();
    const depotMap = {
        "SECUNDERABAD": "Secunderabad",
        "KUSHAIGUDA": "Kushaiguda",
        "MEHDIPATNAM": "Mehdipatnam",
        "FALAKNUMA": "Falaknuma",
        "HCU": "HCU",
        "PATANCHERU": "Patancheru",
        "MIYAPUR": "Miyapur",
        "HAYATHNAGAR": "Hayathnagar",
        "DILSUKHNAGAR": "Dilsukhnagar",
        "CANTONMENT": "Cantonment",
        "JEEDIMETLA": "Jeedimetla",
        "SANATH NAGAR": "Sanath Nagar",
        "KOTI": "Koti",
        "GOLCONDA": "Golconda",
        "UPPAL": "Uppal",
        "MEDAK": "Medak",
        "SANGAREDDY": "Sangareddy"
    };
    const mappedName = depotMap[cleanDepot] || cleanDepot.charAt(0).toUpperCase() + cleanDepot.slice(1).toLowerCase();
    return tLoc(mappedName).toUpperCase();
  };

  const formatTimeDuration = (mins) => {
    if (!mins) return '';
    const hrStr = lang === 'hi' ? 'घंटे' : lang === 'te' ? 'గంటలు' : 'h';
    const minStr = lang === 'hi' ? 'मिनट' : lang === 'te' ? 'నిమిషాలు' : 'm';
    if (mins < 60) return `${mins} ${t('mins')}`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    
    if (lang === 'en') return m > 0 ? `${h}h ${m}m` : `${h}h`;
    if (lang === 'hi') return m > 0 ? `${h} ${hrStr} ${m} ${minStr}` : `${h} ${hrStr}`;
    return m > 0 ? `${h} గం ${m} ని.` : `${h} గం`;
  };

  const translateBusType = (type) => {
    const types = {
        "ORDINARY": { en: "ORDINARY", hi: "साधारण", te: "సాధారణ" },
        "EXPRESS": { en: "EXPRESS", hi: "एक्सप्रेस", te: "ఎక్స్‌ప్రెస్" },
        "METRO EXPRESS": { en: "METRO EXPRESS", hi: "मेट्रो एक्सप्रेस", te: "మెట్రో ఎక్స్‌ప్రెస్" },
        "METRO DELUXE": { en: "METRO DELUXE", hi: "मेट्रो डीलक्स", te: "మెట్రో డీలక్స్" },
        "PALLEVELUGU": { en: "PALLEVELUGU", hi: "पल्लेवेलुगु", te: "పల్లెవెలుగు" },
        "A/C SERIES": { en: "A/C SERIES", hi: "ए/सी सीरीज", te: "ఏ/సీ సిరీస్" }
    };
    return types[type]?.[lang] || type;
  };

  const translateTimeSlot = (slot) => {
    if (!slot) return "";
    if (slot === "Morning Peak") return t('mrng_peak');
    if (slot === "Normal") return t('normal');
    if (slot === "Evening Build-up") return t('eve_buildup');
    if (slot === "Evening Peak") return t('eve_peak');
    if (slot === "Night") return t('night');
    return slot;
  };

  const translateCrowdLevel = (level) => {
    if (!level) return "";
    if (level.toUpperCase() === "HIGH") return t('high');
    if (level.toUpperCase() === "MEDIUM-HIGH") return t('med_high');
    if (level.toUpperCase() === "MEDIUM") return t('medium');
    if (level.toUpperCase() === "LOW") return t('low');
    return level;
  };

  const [appView, setAppView] = useState('dashboard'); 
  const [previousView, setPreviousView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('map'); 
  const [buses, setBuses] = useState([]);
  
  // Sidebar Hamburger State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [routeResults, setRouteResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [transferSuggestion, setTransferSuggestion] = useState(false);

  const [selectedBusId, setSelectedBusId] = useState(null);
  const [detailsTab, setDetailsTab] = useState('info'); 

  const allStops = [...new Set(buses.flatMap(bus => bus.stops?.map(s => s.name) || []))].sort();
  const liveSelectedBus = selectedBusId ? buses.find(b => b.id === selectedBusId) : null;

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Smooth Visual Countdown Effect for ETA / Buffers (9s down to 0s) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setBuses(prevBuses => prevBuses.map(bus => {
        if (bus.etaSeconds > 0) {
           return { ...bus, etaSeconds: bus.etaSeconds - 1 };
        }
        return bus;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLiveTelemetry = async () => {
      const { data: staticData, error: staticErr } = await supabase.from('bus_static_info').select('*');
      const { data: liveData, error: liveErr } = await supabase.from('bus_telemetry').select('*');
      
      if (staticData && liveData) {
        const mergedBuses = staticData.map(staticBus => {
          const liveState = liveData.find(d => d.id === staticBus.id) || {};
          const stopCount = staticBus.stops?.length || 1;
          const rawIndex = liveState.current_stop_index || 0;
          const safeStopIndex = rawIndex % stopCount;
          
          return {
            id: staticBus.id,
            route: staticBus.route,
            type: staticBus.type,
            depot: staticBus.depot,
            totalSeats: staticBus.total_seats,
            scheduledTime: staticBus.scheduled_time,
            timeSlot: staticBus.time_slot,
            crowdLevel: staticBus.crowd_level,
            stops: staticBus.stops || [],
            occupiedSeats: liveState.occupied_seats || 0,
            currentStopIndex: safeStopIndex,
            etaSeconds: liveState.eta_seconds || 0,
            bufferActive: liveState.buffer_active || false,
            estimatedPassHolders: liveState.occupied_seats ? Math.floor(liveState.occupied_seats * 0.3) : 0
          };
        });
        setBuses(mergedBuses);
      } else {
        console.error("Supabase Fetch Error:", staticErr || liveErr);
      }
    };
    
    fetchLiveTelemetry();

    const channel = supabase
      .channel('live-bus-tracking')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bus_telemetry' },
        (payload) => {
          setBuses(prevBuses => prevBuses.map(bus => {
            if (bus.id === payload.new.id) {
               const safeStopIndex = payload.new.current_stop_index % bus.stops.length;
               return {
                ...bus,
                occupiedSeats: payload.new.occupied_seats,
                currentStopIndex: safeStopIndex,
                etaSeconds: payload.new.eta_seconds,
                bufferActive: payload.new.buffer_active
              };
            }
            return bus;
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSwap = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  const executeJourneyPlan = (searchFrom, searchTo, targetView) => {
    if (!searchFrom || !searchTo || searchFrom === searchTo || !allStops.includes(searchFrom) || !allStops.includes(searchTo)) return;

    setRecentSearches(prev => {
      const newSearch = { from: searchFrom, to: searchTo };
      const filtered = prev.filter(s => s.from !== searchFrom || s.to !== searchTo);
      return [newSearch, ...filtered].slice(0, 3); 
    });

    const getDistance = (bus, start, end) => {
      const sIdx = bus.stops.findIndex(x => x.name === start);
      const eIdx = bus.stops.findIndex(x => x.name === end);
      if (sIdx === -1 || eIdx === -1 || sIdx >= eIdx) return { d: -1 }; 
      return { d: eIdx - sIdx, sIdx, eIdx };
    };

    const calcRealisticTime = (stops) => {
        return (stops * 3) + 5 + Math.floor(Math.random() * 5); 
    };

    const calculateFare = (busType, stopsCount, startStop, endStop) => {
        const isOrdinary = busType === 'ORDINARY' || busType === 'PALLEVELUGU';
        const pair = [startStop, endStop].sort().join('-');
        
        if (pair.includes('JNTUH Sulthanpur') && pair.includes('Patancheru')) return 70;
        if (pair.includes('JNTUH Sulthanpur') && pair.includes('Sangareddy')) return 50; 
        if (pair.includes('Sultanpur') && pair.includes('Sangareddy') && !pair.includes('JNTUH')) return 40; 
        if (pair.includes('Patancheru') && pair.includes('Sangareddy')) return 40;

        if (stopsCount <= 3) {
            return isOrdinary ? 20 : 25;
        } else {
            let fare = isOrdinary ? 20 + (stopsCount - 3) * 1.5 : 25 + (stopsCount - 3) * 2;
            if (isOrdinary && fare > 50) fare = 50;
            if (!isOrdinary && fare > 60) fare = 60;
            return Math.round(fare);
        }
    };

    let directResults = [];
    buses.forEach(bus => {
      if (selectedService && bus.type !== selectedService) return;
      const dist = getDistance(bus, searchFrom, searchTo);
      if (dist.d > 0) {
        const timeMins = calcRealisticTime(dist.d);
        const occPercent = Math.round((bus.occupiedSeats / bus.totalSeats) * 100);
        directResults.push({
          type: 'direct', bus: bus, stopsCount: dist.d, fromIdx: dist.sIdx, toIdx: dist.eIdx,
          d1_time: timeMins,
          totalMins: timeMins,
          occupancy: occPercent
        });
      }
    });

    const isMultiLeg = targetView === 'multi_leg';

    if (!isMultiLeg) {
        if (directResults.length === 0) {
            setTransferSuggestion(true);
            setRouteResults([]);
        } else {
            setTransferSuggestion(false);
            setRouteResults(directResults.sort((a,b)=>a.stopsCount-b.stopsCount).slice(0, 10));
        }
        setFromStop(searchFrom);
        setToStop(searchTo);
        setAppView(targetView);
        return;
    }

    // MULTI-LEG CALCULATION
    let transferResults = [];
    
    if (directResults.length === 0) {
      buses.forEach(bus1 => {
        if (selectedService && bus1.type !== selectedService) return;
        const b1FromIdx = bus1.stops.findIndex(s => s.name === searchFrom);
        if (b1FromIdx === -1) return;

        buses.forEach(bus2 => {
          if (bus1.id === bus2.id) return;
          if (selectedService && bus2.type !== selectedService) return;
          if (bus2.stops.findIndex(s => s.name === searchTo) === -1) return;

          const commonStops = bus1.stops.map(s => s.name).filter(name =>
            bus2.stops.findIndex(s => s.name === name) !== -1 && name !== searchFrom && name !== searchTo
          );

          if (commonStops.length > 0) {
            let bestTransfer = null;
            let minTotalStops = Infinity;
            let b1From = 0, b1To = 0, b2From = 0, b2To = 0;

            commonStops.forEach(tStop => {
              const dist1 = getDistance(bus1, searchFrom, tStop);
              const dist2 = getDistance(bus2, tStop, searchTo);
              if (dist1.d > 0 && dist2.d > 0 && (dist1.d + dist2.d) < minTotalStops) {
                minTotalStops = dist1.d + dist2.d;
                bestTransfer = { name: tStop, d1: dist1.d, d2: dist2.d };
                b1From = dist1.sIdx; b1To = dist1.eIdx;
                b2From = dist2.sIdx; b2To = dist2.eIdx;
              }
            });

            if (bestTransfer) {
              const t1 = calcRealisticTime(bestTransfer.d1);
              const t2 = calcRealisticTime(bestTransfer.d2);
              const waitBuffer = 10; 
              const totalMins = t1 + t2 + waitBuffer;

              transferResults.push({
                type: 'transfer', bus1: bus1, bus2: bus2, transferStop: bestTransfer.name, stopsCount: minTotalStops,
                d1: bestTransfer.d1, d2: bestTransfer.d2,
                d1_time: t1, d2_time: t2,
                totalMins: totalMins,
                b1FromIdx: b1From, b1ToIdx: b1To, b2FromIdx: b2From, b2ToIdx: b2To
              });
            }
          }
        });
      });

      if (transferResults.length === 0) {
        buses.forEach(bus1 => {
          if (selectedService && bus1.type !== selectedService) return;
          const b1FromIdx = bus1.stops.findIndex(s => s.name === searchFrom);
          if (b1FromIdx === -1) return;

          buses.forEach(bus3 => {
            if (bus1.id === bus3.id) return;
            if (selectedService && bus3.type !== selectedService) return;
            const b3ToIdx = bus3.stops.findIndex(s => s.name === searchTo);
            if (b3ToIdx === -1) return;

            buses.forEach(bus2 => {
              if (bus2.id === bus1.id || bus2.id === bus3.id) return;
              if (selectedService && bus2.type !== selectedService) return;

              let bestTransfer = null;
              let minTotalStops = Infinity;

              const t1Candidates = bus1.stops.map(s=>s.name).filter(n => n !== searchFrom && bus2.stops.some(s2=>s2.name === n));
              const t2Candidates = bus2.stops.map(s=>s.name).filter(n => n !== searchTo && bus3.stops.some(s3=>s3.name === n));

              t1Candidates.forEach(t1 => {
                const dist1 = getDistance(bus1, searchFrom, t1);
                if (dist1.d <= 0) return;
                t2Candidates.forEach(t2 => {
                  if (t1 === t2) return; 
                  const dist2 = getDistance(bus2, t1, t2);
                  if (dist2.d <= 0) return;
                  const dist3 = getDistance(bus3, t2, searchTo);
                  if (dist3.d <= 0) return;

                  const totalStops = dist1.d + dist2.d + dist3.d;
                  if (totalStops < minTotalStops) {
                    minTotalStops = totalStops;
                    bestTransfer = { t1, t2, d1: dist1.d, d2: dist2.d, d3: dist3.d, s1: dist1.sIdx, e1: dist1.eIdx, s2: dist2.sIdx, e2: dist2.eIdx, s3: dist3.sIdx, e3: dist3.eIdx };
                  }
                });
              });

              if (bestTransfer) {
                const { t1, t2, d1, d2, d3, s1, e1, s2, e2, s3, e3 } = bestTransfer;
                const min1 = calcRealisticTime(d1);
                const min2 = calcRealisticTime(d2);
                const min3 = calcRealisticTime(d3);
                const waitBuffer = 20;
                const totalMins = min1 + min2 + min3 + waitBuffer;

                transferResults.push({
                  type: 'transfer-2', bus1, bus2, bus3, t1, t2, stopsCount: minTotalStops,
                  d1, d2, d3,
                  d1_time: min1, d2_time: min2, d3_time: min3,
                  totalMins: totalMins,
                  b1FromIdx: s1, b1ToIdx: e1, b2FromIdx: s2, b2ToIdx: e2, b3FromIdx: s3, b3ToIdx: e3
                });
              }
            });
          });
        });
      }
    }

    const allCombined = [...directResults, ...transferResults].sort((a, b) => a.stopsCount - b.stopsCount);
    
    const uniqueResults = [];
    const seenPaths = new Set();
    const assignedTips = new Set();

    allCombined.forEach(r => {
      let pathSignature = "";
      if (r.type === 'direct') {
          pathSignature = `DIR-${getBusNum(r.bus.route)}`;
      } else if (r.type === 'transfer') {
          pathSignature = `T1-${getBusNum(r.bus1.route)}-${r.transferStop}-${getBusNum(r.bus2.route)}`;
      } else {
          pathSignature = `T2-${getBusNum(r.bus1.route)}-${r.t1}-${getBusNum(r.bus2.route)}-${r.t2}-${getBusNum(r.bus3.route)}`;
      }

      if (!seenPaths.has(pathSignature)) {
        seenPaths.add(pathSignature);

        const types = [r.bus?.type, r.bus1?.type, r.bus2?.type, r.bus3?.type].filter(Boolean);
        const allOrdinary = types.length > 0 && types.every(typ => typ === 'ORDINARY' || typ === 'PALLEVELUGU');
        const stopsCount = r.stopsCount;
        
        let fare = 0;
        if (r.type === 'direct') {
            fare = calculateFare(r.bus.type, r.stopsCount, searchFrom, searchTo);
        } else if (r.type === 'transfer') {
            fare = calculateFare(r.bus1.type, r.d1, searchFrom, r.transferStop) + 
                   calculateFare(r.bus2.type, r.d2, r.transferStop, searchTo);
        } else {
            fare = calculateFare(r.bus1.type, r.d1, searchFrom, r.t1) + 
                   calculateFare(r.bus2.type, r.d2, r.t1, r.t2) + 
                   calculateFare(r.bus3.type, r.d3, r.t2, searchTo);
        }

        let pool = [];

        if (allOrdinary) { pool.push({ cat: 'budget', textKey: 'tip_budget', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }); }
        if (stopsCount < 10) pool.push({ cat: 'fast', textKey: 'tip_fast', color: 'text-amber-700 bg-amber-50 border-amber-200' });
        if (stopsCount > 25) pool.push({ cat: 'scenic', textKey: 'tip_scenic', color: 'text-slate-700 bg-slate-50 border-slate-200' });
        if (r.type === 'direct' && stopsCount >= 10 && stopsCount <= 25) pool.push({ cat: 'direct', textKey: 'tip_direct', color: 'text-blue-700 bg-blue-50 border-blue-200' });
        if (r.type !== 'direct' && stopsCount < 15) pool.push({ cat: 'quick_transfer', textKey: 'tip_quick_transfer', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' });
        if (r.type === 'transfer-2') pool.push({ cat: 'multi', textKey: 'tip_multi', color: 'text-purple-700 bg-purple-50 border-purple-200' });

        const fallbackTips = [
            { cat: 'f1', textKey: 'tip_f1', color: 'text-sky-700 bg-sky-50 border-sky-200' },
            { cat: 'f2', textKey: 'tip_f2', color: 'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200' },
            { cat: 'f3', textKey: 'tip_f3', color: 'text-teal-700 bg-teal-50 border-teal-200' },
            { cat: 'f4', textKey: 'tip_f4', color: 'text-lime-700 bg-lime-50 border-lime-200' },
            { cat: 'f5', textKey: 'tip_f5', color: 'text-orange-700 bg-orange-50 border-orange-200' },
            { cat: 'f6', textKey: 'tip_f6', color: 'text-rose-700 bg-rose-50 border-rose-200' }
        ];

        pool = [...pool, ...fallbackTips];
        
        let selected = pool.find(item => !assignedTips.has(item.cat));
        if (!selected) {
             selected = fallbackTips[Math.floor(Math.random() * fallbackTips.length)]; 
        } else {
             assignedTips.add(selected.cat);
        }

        r.tipInfo = { tipKey: selected.textKey, tipColor: selected.color, fare: Math.max(10, fare) };

        uniqueResults.push(r);
      }
    });

    setTransferSuggestion(false);
    setRouteResults(uniqueResults.slice(0, 10)); 
    setFromStop(searchFrom);
    setToStop(searchTo);
    setAppView(targetView);
  };

  const handlePlanJourney = () => {
    executeJourneyPlan(fromStop, toStop, appView);
  };

  const openBusDetails = (busId) => {
    setSelectedBusId(busId);
    setPreviousView(appView);
    setAppView('bus_details');
    setDetailsTab('info');
  };

  const renderBusDetails = () => {
    if (!liveSelectedBus) return null;
    
    const getMockTime = (idx, offsetMins = 0) => {
      const baseDate = liveSelectedBus.scheduledTime 
        ? parseTime(liveSelectedBus.scheduledTime) 
        : new Date();
      baseDate.setMinutes(baseDate.getMinutes() + (idx * 3) + offsetMins);
      const ampm = baseDate.getHours() >= 12 ? 'PM' : 'AM';
      let hours = baseDate.getHours() % 12;
      hours = hours ? hours : 12;
      return `${hours.toString().padStart(2, '0')}:${baseDate.getMinutes().toString().padStart(2, '0')} ${ampm}`;
    };

    const currentOccupancyPercent = Math.round((liveSelectedBus.occupiedSeats / liveSelectedBus.totalSeats) * 100);
    let tipTitle = ""; let tipText = ""; let tipColor = ""; let tipIcon = null;

    if (currentOccupancyPercent <= 75) {
        tipTitle = lang === 'en' ? "Good to Board" : lang === 'hi' ? "बोर्ड करने के लिए अच्छा है" : "ఎక్కడానికి అనుకూలం";
        tipText = lang === 'en' ? "Seats are currently available. You will likely get a seat without issue." : lang === 'hi' ? "सीटें वर्तमान में उपलब्ध हैं। आपको बिना किसी समस्या के सीट मिल जाएगी।" : "ప్రస్తుతం సీట్లు అందుబాటులో ఉన్నాయి. మీకు ఎలాంటి ఇబ్బంది లేకుండా సీటు దొరుకుతుంది.";
        tipColor = "text-blue-700 bg-blue-50 border-blue-200";
        tipIcon = <Activity className="h-5 w-5 text-blue-600" />;
    } else if (currentOccupancyPercent >= 100) {
        tipTitle = lang === 'en' ? "Overcrowded (Standing Only)" : lang === 'hi' ? "अत्यधिक भीड़ (केवल खड़े होने के लिए)" : "అత్యధిక రద్దీ (నిలబడటానికి మాత్రమే)";
        tipText = lang === 'en' ? `This bus is operating at ${currentOccupancyPercent}% capacity. Expect to stand. Consider waiting for the next bus if you are travelling far.` : lang === 'hi' ? `यह बस ${currentOccupancyPercent}% क्षमता पर चल रही है। खड़े होने की अपेक्षा करें।` : `ఈ బస్సు ${currentOccupancyPercent}% సామర్థ్యంతో నడుస్తోంది. నిలబడాల్సి ఉంటుంది.`;
        tipColor = "text-rose-700 bg-rose-50 border-rose-200";
        tipIcon = <AlertCircle className="h-5 w-5 text-rose-600" />;
    } else {
        const nextStopIdx = (liveSelectedBus.currentStopIndex + 1) % liveSelectedBus.stops.length;
        const nextStopName = liveSelectedBus.stops[nextStopIdx].name;
        const expectedDeboarding = getDeparturingPassengers(nextStopName);

        if (expectedDeboarding >= 3) {
            tipTitle = lang === 'en' ? "Hold On, Seats Opening" : lang === 'hi' ? "रुकें, सीटें खुल रही हैं" : "ఆగండి, సీట్లు ఖాళీ అవుతున్నాయి";
            tipText = lang === 'en' ? `Bus is nearly full (${currentOccupancyPercent}%), but approx. ${expectedDeboarding} passengers are expected to deboard at the very next stop (${tLoc(nextStopName)}).` : lang === 'hi' ? `बस लगभग भरी हुई है (${currentOccupancyPercent}%), लेकिन अगले स्टॉप पर लगभग ${expectedDeboarding} यात्री उतरने की उम्मीद है।` : `బస్సు దాదాపు నిండిపోయింది (${currentOccupancyPercent}%), కానీ తదుపరి స్టాప్‌లో సుమారు ${expectedDeboarding} మంది ప్రయాణికులు దిగే అవకాశం ఉంది.`;
            tipColor = "text-indigo-700 bg-indigo-50 border-indigo-200";
            tipIcon = <Lightbulb className="h-5 w-5 text-indigo-600" />;
        } else {
            tipTitle = lang === 'en' ? "Almost Full" : lang === 'hi' ? "लगभग भरा हुआ" : "దాదాపు నిండింది";
            tipText = lang === 'en' ? "Seats are filling up fast. You may need to share a seat or stand for a short while before someone deboards." : lang === 'hi' ? "सीटें तेजी से भर रही हैं। आपको किसी के उतरने तक थोड़ी देर खड़ा रहना पड़ सकता है।" : "సీట్లు వేగంగా నిండుతున్నాయి. ఎవరైనా దిగే వరకు మీరు కొద్దిసేపు నిలబడాల్సి రావచ్చు.";
            tipColor = "text-amber-700 bg-amber-50 border-amber-200";
            tipIcon = <Info className="h-5 w-5 text-amber-600" />;
        }
    }

    const gaugeColor = currentOccupancyPercent >= 100 ? '#e11d48' : currentOccupancyPercent > 80 ? '#f59e0b' : '#2563eb';

    return (
      <div className="max-w-md mx-auto md:max-w-4xl w-full bg-white md:rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-[calc(100dvh-110px)] md:h-[800px] max-h-full md:max-h-[90vh]">
        <div className="bg-[#2563eb] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setAppView(previousView)} className="p-1 hover:bg-white/20 rounded-full transition">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold">{t('bus_details')}</h2>
          </div>
          <div className="flex gap-4">
            <RefreshCw className="h-5 w-5 text-white/80 cursor-pointer" />
            <AlertCircle className="h-5 w-5 text-white/80 cursor-pointer" />
          </div>
        </div>

        <div className="flex border-b border-slate-200 shrink-0 bg-white z-20 overflow-x-auto">
          <button 
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wide border-b-4 transition whitespace-nowrap ${detailsTab === 'info' ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setDetailsTab('info')}
          >
            {t('live_status')}
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wide border-b-4 transition whitespace-nowrap ${detailsTab === 'timeline' ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setDetailsTab('timeline')}
          >
            {t('route_timeline')}
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wide border-b-4 transition whitespace-nowrap ${detailsTab === 'map' ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setDetailsTab('map')}
          >
            {t('map_view')}
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wide border-b-4 transition whitespace-nowrap ${detailsTab === 'seats' ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setDetailsTab('seats')}
          >
            {t('seat_status')}
          </button>
        </div>

        <div className="flex-1 relative flex flex-col overflow-hidden bg-slate-50">
          
          {/* MAP VIEW TAB */}
          {detailsTab === 'map' && (
             <div className="absolute inset-0 z-0 flex flex-col">
               <BusRouteMap bus={liveSelectedBus} loadingText={t('loading_map')} tLoc={tLoc} />
             </div>
          )}
          
          {/* ROUTE TIMELINE TAB */}
          {detailsTab === 'timeline' && (
            <div className="absolute inset-0 bg-white z-30 overflow-y-auto p-6 flex flex-col">
                <div className="max-w-2xl mx-auto w-full relative pl-2">
                    <div className="absolute left-[11px] top-2 bottom-8 w-1 bg-slate-200"></div>
                    
                    {liveSelectedBus.stops.map((stop, idx) => {
                        const isPast = idx < liveSelectedBus.currentStopIndex;
                        const isCurrent = idx === liveSelectedBus.currentStopIndex;
                        const isFuture = idx > liveSelectedBus.currentStopIndex;

                        const departingCount = getDeparturingPassengers(stop.name);

                        return (
                        <div key={idx} className={`relative flex items-start gap-6 mb-8 ${isPast ? 'opacity-60' : ''}`}>
                            <div className="relative z-10 mt-1">
                            {isPast && <div className="w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>}
                            {isCurrent && (
                                <div className="relative flex items-center justify-center">
                                <div className="absolute w-8 h-8 rounded-full bg-[#2563eb] opacity-30 animate-ping"></div>
                                <div className="w-6 h-6 rounded-full bg-[#2563eb] border-4 border-white flex items-center justify-center text-white shadow-sm">
                                    <Bus className="h-3 w-3" />
                                </div>
                                </div>
                            )}
                            {isFuture && <div className="w-6 h-6 rounded-full bg-white border-4 border-[#2563eb] shadow-sm"></div>}
                            </div>

                            <div className="flex-1 -mt-1 border-b border-slate-100 pb-4">
                            <h4 className={`text-sm font-bold ${isPast ? 'text-slate-600' : 'text-slate-800'}`}>
                                {tLoc(stop.name)}
                            </h4>
                            <div className="flex items-center gap-6 mt-1 text-[13px] font-medium">
                                <span className="flex items-center gap-1 text-slate-500">
                                <ArrowRight className="h-3 w-3" /> {getMockTime(idx, 0)}
                                </span>
                            </div>
                            {isPast && <span className="text-xs font-bold text-rose-600 mt-1 inline-block">{t('bus_left')}</span>}
                            {isCurrent && (
                                <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-xs border border-blue-200 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> 
                                {liveSelectedBus.bufferActive ? `${t('updating_buffer')} (${liveSelectedBus.etaSeconds}${t('sec')})` : t('arriving')}
                                </div>
                            )}
                            
                            {isFuture && (
                                <div className="mt-2 text-[11px] font-bold text-slate-500 bg-slate-50 py-1.5 px-2.5 rounded-md border border-slate-200 inline-flex items-center gap-2 shadow-sm">
                                <UserMinus className="h-3.5 w-3.5 text-rose-500" /> 
                                <span className="text-slate-600">{t('expected_deboarding_list')} {departingCount}</span>
                                </div>
                            )}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
          )}

          {/* SEAT STATUS TAB */}
          {detailsTab === 'seats' && (
            <div className="absolute inset-0 bg-slate-50 z-30 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">{t('live_crowd')}</h3>
                <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-slate-50 shadow-inner border-[10px] border-slate-100 mb-8">
                  <div 
                    className="absolute inset-0 rounded-full border-[10px] border-transparent" 
                    style={{ 
                      borderTopColor: gaugeColor, 
                      borderRightColor: gaugeColor,
                      borderBottomColor: currentOccupancyPercent > 80 ? gaugeColor : 'transparent',
                      borderLeftColor: currentOccupancyPercent >= 100 ? gaugeColor : 'transparent',
                      transform: 'rotate(45deg)',
                      transition: 'all 0.5s ease-in-out'
                    }}>
                  </div>
                  <div className="flex flex-col items-center z-10">
                    <span className={`text-4xl sm:text-5xl font-extrabold`} style={{ color: gaugeColor }}>
                      {currentOccupancyPercent}%
                    </span>
                    <span className="text-sm font-bold text-slate-400 mt-1 uppercase">{t('full')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full max-w-sm border-t border-slate-100 pt-6">
                  <div>
                     <p className="text-sm text-slate-500 font-semibold mb-1">{t('seating_cap')}</p>
                     <p className="text-3xl font-bold text-slate-800">{liveSelectedBus.totalSeats}</p>
                  </div>
                  <div>
                     <p className="text-sm text-slate-500 font-semibold mb-1">{t('passengers_on_board')}</p>
                     <p className={`text-3xl font-bold ${liveSelectedBus.occupiedSeats > liveSelectedBus.totalSeats ? 'text-rose-600' : 'text-slate-800'}`}>
                        {liveSelectedBus.occupiedSeats}
                     </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl shadow-sm border p-6 ${tipColor}`}>
                 <div className="flex items-center gap-3 mb-2">
                   {tipIcon}
                   <h4 className="font-bold text-xl">{tipTitle}</h4>
                 </div>
                 <p className="text-base font-medium opacity-90 leading-relaxed ml-9">{tipText}</p>
              </div>
            </div>
          )}

          {/* LIVE STATUS TAB */}
          {detailsTab === 'info' && (
            <div className="absolute inset-0 bg-slate-50 z-30 overflow-y-auto p-4 md:p-6 flex flex-col">
               <div className="flex flex-col md:flex-row gap-6 h-full items-stretch">
                   
                  {/* Left Column: Live Bus Status */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 md:max-w-[45%] flex flex-col">
                     <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                       <span role="img" aria-label="satellite" className="text-xl">📡</span> {t('live_bus_status')}
                     </h3>
                     
                     <div className="space-y-4 text-[15px] flex-1">
                        <p><span className="font-bold text-slate-800">{t('current_bus')}</span> <span className="text-[#004aad] font-bold ml-1">{liveSelectedBus.id}</span></p>
                        <p><span className="font-bold text-slate-800">{t('start_time_label')}</span> <span className="ml-1">{liveSelectedBus.scheduledTime || "N/A"}</span></p>
                        <p><span className="font-bold text-slate-800">{t('simulation_time')}</span> <span className="ml-1">{getMockTime(liveSelectedBus.currentStopIndex)}</span></p>
                        <p><span className="font-bold text-slate-800">{t('current_stop')}</span> <span className="ml-1">{tLoc(liveSelectedBus.stops[liveSelectedBus.currentStopIndex].name)}</span></p>
                        
                        <div className="pt-2">
                            <span className="font-bold text-slate-800">{t('ticket_status')}</span> 
                            {liveSelectedBus.bufferActive ? (
                                <span className="text-amber-500 font-bold ml-2">{t('updating')}</span>
                            ) : (
                                <span className="text-green-700 font-bold ml-2">{t('confirmed')}</span>
                            )}
                        </div>
                        
                        <p className="pt-2"><span className="font-bold text-slate-800">{t('tickets_issued')}</span> <span className="ml-1">{Math.max(0, liveSelectedBus.occupiedSeats - liveSelectedBus.estimatedPassHolders)}</span></p>
                        <p><span className="font-bold text-slate-800">{t('estimated_pass_holders')}</span> <span className="ml-1">{liveSelectedBus.estimatedPassHolders}</span></p>
                        <p><span className="font-bold text-slate-800">{t('total_occupancy')}</span> <span className="ml-1">{liveSelectedBus.occupiedSeats}</span></p>
                        
                        <div className="pt-4">
                            <span className="font-bold text-slate-800">{t('seats_available')}</span> 
                            {liveSelectedBus.bufferActive ? (
                                <span className="text-amber-500 font-bold ml-2">{t('updating')}</span>
                            ) : (
                                <span className="text-green-700 font-bold ml-2">{Math.max(0, liveSelectedBus.totalSeats - liveSelectedBus.occupiedSeats)} {t('seats_available_est')}</span>
                            )}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Upcoming Stops */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col min-h-[400px]">
                     <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 shrink-0">
                       <span role="img" aria-label="stopwatch" className="text-xl">⏱️</span> {t('upcoming_stops_title')}
                     </h3>
                     
                     <div className="flex-1 overflow-y-auto pr-3 space-y-4 border border-slate-200 rounded-lg p-4 bg-[#fafafa]">
                        {liveSelectedBus.stops.slice(liveSelectedBus.currentStopIndex).length === 0 && (
                            <p className="text-slate-500 italic">{t('no_upcoming_stops')}</p>
                        )}
                        {liveSelectedBus.stops.slice(liveSelectedBus.currentStopIndex).map((stop, idx) => {
                           const actualIdx = liveSelectedBus.currentStopIndex + idx;
                           const eta = getMockTime(actualIdx);
                           const departuring = getDeparturingPassengers(stop.name);
                           
                           return (
                             <div key={idx} className="border-b border-slate-300 pb-3 last:border-0 last:pb-0">
                                <p className="text-[15px] font-bold text-slate-900 mb-1">{tLoc(stop.name)} - ETA: {eta}</p>
                                <p className="text-[14px] text-slate-700 flex items-center gap-1.5">
                                  <span role="img" aria-label="walking">🚶</span> {t('expected_deboarding_list')} <span className="font-bold">{departuring}</span>
                                </p>
                             </div>
                           );
                        })}
                     </div>
                  </div>

               </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  const filteredBuses = buses.filter(bus => 
    bus.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
    bus.stops.some(stop => stop.name.toLowerCase().includes(searchQuery.toLowerCase()) || tLoc(stop.name).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 font-sans overflow-hidden">
      
      <style>{`
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        .leaflet-container { z-index: 0 !important; }

        .custom-bus-tooltip {
           background-color: #1e293b !important;
           border: 2px solid white !important;
           font-weight: 800 !important;
           color: white !important;
           border-radius: 6px !important;
           padding: 4px 8px !important;
           font-size: 12px !important;
           box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
           text-transform: uppercase !important;
        }
        .custom-bus-tooltip::before {
           border-top-color: #1e293b !important; 
        }
      `}</style>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* LEFT SIDEBAR / HAMBURGER MENU */}
      <aside className={`fixed lg:static inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-0 lg:overflow-hidden lg:border-none'}`}>
        <div className="bg-[#2563eb] text-white p-5 flex items-center justify-between shrink-0 shadow-sm min-w-[16rem]">
          <div className="flex items-center gap-3">
             <Bus className="h-6 w-6 text-white shrink-0" />
             <div className="overflow-hidden">
               <h1 className="text-xl font-bold tracking-tight leading-tight whitespace-nowrap">SPTIS</h1>
               <p className="text-[9px] font-medium text-blue-100 uppercase tracking-widest mt-0.5 truncate whitespace-nowrap">Smart Simulation Interface</p>
             </div>
          </div>
          {/* Close Menu Button (Mobile Only) */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 bg-white/20 rounded-md hover:bg-white/30 transition-colors">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-w-[16rem]">
          <button 
            onClick={() => { setAppView('dashboard'); setSelectedBusId(null); setRouteResults(null); setTransferSuggestion(false); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 group ${appView === 'dashboard' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-[#2563eb]'}`}
          >
            <Home className={`h-5 w-5 transition-colors ${appView === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-[#2563eb]'}`} />
            {t('home')}
          </button>
          
          <button 
            onClick={() => { setAppView('planner'); setSelectedBusId(null); setRouteResults(null); setTransferSuggestion(false); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 group ${appView === 'planner' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-[#2563eb]'}`}
          >
            <Search className={`h-5 w-5 transition-colors ${appView === 'planner' ? 'text-white' : 'text-slate-400 group-hover:text-[#2563eb]'}`} />
            {t('planner')}
          </button>

          <button 
            onClick={() => { setAppView('multi_leg'); setSelectedBusId(null); setRouteResults(null); setTransferSuggestion(false); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 group ${appView === 'multi_leg' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-[#2563eb]'}`}
          >
            <Route className={`h-5 w-5 transition-colors ${appView === 'multi_leg' ? 'text-white' : 'text-slate-400 group-hover:text-[#2563eb]'}`} />
            {t('multi_planner')}
          </button>

          <button 
            onClick={() => { setAppView('routes'); setSelectedBusId(null); setRouteResults(null); setTransferSuggestion(false); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 group ${appView === 'routes' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-[#2563eb]'}`}
          >
            <List className={`h-5 w-5 transition-colors ${appView === 'routes' ? 'text-white' : 'text-slate-400 group-hover:text-[#2563eb]'}`} />
            {t('routes_dir')}
          </button>

          <button 
            onClick={() => { setAppView('schedule'); setSelectedBusId(null); setRouteResults(null); setTransferSuggestion(false); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 group ${appView === 'schedule' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-[#2563eb]'}`}
          >
            <CalendarDays className={`h-5 w-5 transition-colors ${appView === 'schedule' ? 'text-white' : 'text-slate-400 group-hover:text-[#2563eb]'}`} />
            {t('route_schedule')}
          </button>

          {/* Added back for mobile access in the sidebar menu */}
          <button 
            onClick={() => { setAppView('developers'); setSelectedBusId(null); setRouteResults(null); setTransferSuggestion(false); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`w-full flex lg:hidden items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 group ${appView === 'developers' ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50 hover:text-[#2563eb]'}`}
          >
            <Code className={`h-5 w-5 transition-colors ${appView === 'developers' ? 'text-white' : 'text-slate-400 group-hover:text-[#2563eb]'}`} />
            {t('developers_corner')}
          </button>
        </nav>

        {/* REGIONAL LANGUAGE SWITCHER */}
        <div className="p-4 border-t border-slate-200 shrink-0 min-w-[16rem]">
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            <Globe className="h-4 w-4" /> Language / भाषा / భాష
          </label>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="w-full bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563eb] border border-slate-200 cursor-pointer"
          >
            <option value="en">English (Default)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden z-10 w-full lg:w-auto">
        
        {/* DYNAMIC TOP HEADER FOR EXPAND/COLLAPSE */}
        <header className="bg-white border-b border-slate-200 h-[72px] px-4 sm:px-6 flex items-center shrink-0 z-20 gap-4">
           <div className="flex items-center gap-3">
               <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                  className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 hover:text-[#2563eb] transition-all shadow-sm flex-shrink-0"
               >
                  <Menu className="h-6 w-6" />
               </button>
               {/* SPTIS Header logic so Hamburger is right next to it when sidebar hides */}
               <h1 className={`text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5 ${isSidebarOpen ? 'lg:hidden' : ''}`}>
                 <Bus className="h-7 w-7 text-[#2563eb]" /> SPTIS
               </h1>
           </div>
           
           {/* Visible only on Desktop (lg) screens */}
           <button 
             onClick={() => { setAppView('developers'); setSelectedBusId(null); setRouteResults(null); setTransferSuggestion(false); }}
             className={`ml-auto hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition border cursor-pointer ${appView === 'developers' ? 'bg-[#2563eb] text-white shadow-sm border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'}`}
           >
             <Code className="h-4 w-4" /> Developer's Corner
           </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {appView === 'bus_details' && renderBusDetails()}
          
          {appView === 'dashboard' && (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto w-full lg:h-[calc(100vh-120px)] pb-10 lg:pb-0">
              <aside className="w-full lg:w-1/3 flex flex-col gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('find_bus')}</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder={t('search_placeholder')} 
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none relative z-10"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if(e.target.value !== '') setActiveTab('list'); 
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      {t('tracking_info').replace('{b}', buses.length).replace('{s}', allStops.length)}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4" /> {t('system_indicators')}
                  </h3>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                      <p><strong>{t('updating_buffer')}</strong> {t('passenger_counts_est')}</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                      <p><strong>{t('confirmed_seats')}</strong> {t('ticket_buffer_cleared')}</p>
                    </li>
                  </ul>
                </div>
              </aside>

              <section className="w-full lg:w-2/3 flex flex-col lg:h-full">
                <div className="flex bg-slate-200 p-1 rounded-lg w-fit mb-6">
                  <button 
                    onClick={() => setActiveTab('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'map' ? 'bg-white shadow-sm text-[#2563eb]' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <MapIcon className="h-4 w-4" /> {t('map_view')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'list' ? 'bg-white shadow-sm text-[#2563eb]' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Bus className="h-4 w-4" /> {t('list_view')}
                  </button>
                </div>

                {activeTab === 'list' ? (
                  <div className="space-y-4 h-[450px] sm:h-[600px] lg:h-full lg:max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {filteredBuses.length > 0 ? filteredBuses.map((bus) => {
                      const currentLocationStr = bus.bufferActive 
                        ? tLoc(bus.stops[bus.currentStopIndex].name) 
                        : `${tLoc(bus.stops[bus.currentStopIndex].name)} (${t('expected_depart').replace(':','')})`;
                      const nextStopStr = tLoc(bus.stops[(bus.currentStopIndex + 1) % bus.stops.length].name);

                      const occPercent = Math.round((bus.occupiedSeats / bus.totalSeats) * 100);
                      const progressColor = occPercent >= 100 ? 'bg-rose-500' : occPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500';

                      return (
                      <div key={bus.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-[#2563eb] hover:shadow-md transition cursor-pointer" onClick={() => openBusDetails(bus.id)}>
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                                  {bus.id}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2 py-1 rounded">
                                  {translateBusType(bus.type)}
                                </span>
                                {bus.scheduledTime && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                    {bus.scheduledTime}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-slate-900">{bus.route.split(' - ')[0]} - {getTranslatedRouteDesc(bus.route)}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 shrink-0" /> {currentLocationStr}</span>
                                <span className="flex items-center gap-1"><Clock className="h-4 w-4 shrink-0" /> {t('next')}: {nextStopStr} ({bus.bufferActive ? t('at_stop') : `${bus.etaSeconds}${t('sec')}`})</span>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${bus.bufferActive ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
                              {bus.bufferActive ? `${t('boarding')} (${bus.etaSeconds}${t('sec')})` : t('running')}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                            <div className="bg-slate-50 p-3 rounded-lg flex flex-col justify-center">
                              <div className="flex items-center gap-2 text-slate-600 mb-1">
                                <Users className="h-4 w-4" /> 
                                <span className="text-sm font-medium">{t('on_board')}</span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-bold ${bus.occupiedSeats >= bus.totalSeats ? 'text-rose-600' : 'text-slate-900'}`}>{bus.occupiedSeats}</span>
                                <span className="text-xs text-slate-500">/ {bus.totalSeats} {t('cap')}</span>
                              </div>
                            </div>
                            
                            <div className="sm:col-span-2 flex flex-col justify-center p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-inner">
                              <div className="flex justify-between items-end mb-2.5">
                                <div className="flex items-center gap-1.5">
                                  <Activity className={`w-4 h-4 ${bus.bufferActive ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`} />
                                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {bus.bufferActive ? t('syncing_sensors') : t('live_crowd')}
                                  </span>
                                </div>
                                <div className="text-[10px] font-black text-slate-500 flex items-center gap-1.5">
                                  <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                    <Users className="w-3 h-3 text-[#2563eb]" /> {t('pass_holders')}: ~{bus.estimatedPassHolders}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex relative shadow-inner">
                                <div 
                                  className={`h-full transition-all duration-700 ease-in-out ${progressColor} relative`} 
                                  style={{ width: `${Math.min(100, occPercent)}%` }}
                                >
                                  {bus.bufferActive && (
                                    <div className="absolute inset-0 bg-white/30 animate-[pulse_1s_ease-in-out_infinite]"></div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wide">
                                <span className={`${occPercent >= 100 ? 'text-rose-600' : 'text-slate-500'}`}>
                                  {occPercent}% {t('full')}
                                </span>
                                <span className="text-slate-500">
                                  {Math.max(0, bus.totalSeats - bus.occupiedSeats)} {t('seats_available')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}) : (
                      <div className="p-8 text-center text-slate-500">{t('no_match')} "{searchQuery}"</div>
                    )}
                  </div>
                ) : (
                  <MapComponent buses={buses} tLoc={tLoc} t={t} getTranslatedRouteDesc={getTranslatedRouteDesc} translateBusType={translateBusType} />
                )}
              </section>
            </div>
          )}

          {/* COMBINED VIEW FOR BUS FINDER & MULTI-LEG PLANNER */}
          {(appView === 'planner' || appView === 'multi_leg') && (
            <div className="max-w-3xl mx-auto flex flex-col gap-6 w-full pb-10">
              
              {appView === 'multi_leg' && (
                <div className="bg-indigo-50 px-5 py-4 rounded-2xl border border-indigo-100 flex items-start gap-3 shadow-sm">
                   <Sparkles className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" />
                   <p className="text-sm text-indigo-800 font-medium leading-relaxed">{t('planner_info')}</p>
                </div>
              )}

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 relative z-30">
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{appView === 'multi_leg' ? t('search_multi') : t('search_from_to')}</h2>
                </div>
                
                {/* REDESIGNED HORIZONTAL SEARCH BAR */}
                <div className="bg-slate-50 p-2 rounded-[2rem] border border-slate-200 relative z-30 flex flex-col md:flex-row items-stretch mb-6 gap-2">
                   
                   <div className="flex-1 bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100">
                     <AutocompleteInput 
                        label={t('from')} 
                        value={fromStop} 
                        onChange={setFromStop} 
                        placeholder={t('location')} 
                        options={allStops} 
                        icon={<MapPin className="w-3 h-3 text-slate-400" />}
                        tLoc={tLoc}
                     />
                   </div>
                   
                   <div className="relative flex items-center justify-center -my-3 md:my-0 md:-mx-3 z-40">
                      <button 
                         onClick={handleSwap} 
                         className="bg-[#2563eb] text-white p-3 rounded-full shadow-lg border-4 border-slate-50 hover:bg-blue-700 transition-transform hover:scale-110 active:scale-95"
                      >
                         <ArrowDownUp className="w-5 h-5 md:-rotate-90" />
                      </button>
                   </div>
                   
                   <div className="flex-1 bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100">
                     <AutocompleteInput 
                        label={t('to')} 
                        value={toStop} 
                        onChange={setToStop} 
                        placeholder={t('location')} 
                        options={allStops} 
                        icon={<MapPinOff className="w-3 h-3 text-slate-400" />}
                        tLoc={tLoc}
                     />
                   </div>

                </div>

                {/* CENTERED SERVICES DROPDOWN */}
                <div className="mb-8 relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
                  <label className="flex items-center justify-center gap-1.5 text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest text-center w-full">
                    <Bus className="w-3 h-3" /> {t('service_type')}
                  </label>
                  <select 
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-[#2563eb] outline-none bg-white text-slate-800 font-bold transition-all appearance-none text-center"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    style={{ textAlignLast: 'center' }}
                  >
                    <option value="">{t('all_services')}</option>
                    {serviceTypes.map(type => <option key={type} value={type}>{translateBusType(type)}</option>)}
                  </select>
                </div>

                <button 
                  onClick={handlePlanJourney}
                  disabled={!fromStop || !toStop || fromStop === toStop || !allStops.includes(fromStop) || !allStops.includes(toStop)}
                  className="w-full bg-[#2563eb] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] relative z-10 tracking-wide"
                >
                  {appView === 'multi_leg' ? t('discover_routes') : t('search_bus')}
                </button>
              </div>

              {recentSearches.length > 0 && !routeResults && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('recent_history')}</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {recentSearches.map((search, idx) => (
                      <div key={idx} className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition border border-slate-100" onClick={() => { setFromStop(search.from); setToStop(search.to); }}>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          {tLoc(search.from)} <ArrowRight className="h-4 w-4 text-slate-300" /> {tLoc(search.to)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MESSAGE IF NO DIRECT ROUTE FOUND IN BUS FINDER */}
              {transferSuggestion && appView === 'planner' && (
                 <div className="p-8 text-center bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm mt-2">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Route className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-black text-indigo-900 mb-2 tracking-tight">{t('transfers_required')}</h3>
                    <p className="text-sm font-medium text-indigo-700 leading-relaxed max-w-sm mx-auto">{t('transfer_suggestion')}</p>
                    <button 
                      onClick={() => executeJourneyPlan(fromStop, toStop, 'multi_leg')} 
                      className="mt-6 bg-[#2563eb] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition"
                    >
                      {t('open_multi_leg_planner')}
                    </button>
                 </div>
              )}

              {routeResults && routeResults.length === 0 && (!transferSuggestion || appView === 'multi_leg') && (
                <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-sm mt-4">
                  <ShieldAlert className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-slate-800">{t('no_routes')}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-2 max-w-md mx-auto">We couldn't find a direct or multi-transfer route between these locations. Try selecting a nearby major transit hub.</p>
                </div>
              )}

              {routeResults && routeResults.length > 0 && (
                <div className="space-y-5 relative z-0">
                  <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-2 px-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{appView === 'multi_leg' ? t('available_journey_options') : t('all_upcoming')}</h3>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{routeResults.length} {t('results_found')}</span>
                  </div>
                  
                  {routeResults.map((result, idx) => {
                    // Extract core bus number
                    const busNum1 = result.bus ? getBusNum(result.bus.route) : result.bus1 ? getBusNum(result.bus1.route) : '';
                    const busNum2 = result.bus2 ? getBusNum(result.bus2.route) : '';
                    const busNum3 = result.bus3 ? getBusNum(result.bus3.route) : '';
                    
                    const { tipKey, tipColor, fare } = result.tipInfo || { tipKey: 'tip_f1', tipColor: 'text-slate-700 bg-slate-50 border-slate-200', fare: 0 };

                    return (
                    <div 
                        key={idx} 
                        className={`transition ${appView === 'planner' ? 'cursor-pointer' : 'cursor-default'}`} 
                        onClick={() => { if(appView === 'planner') openBusDetails(result.bus?.id || result.bus1?.id) }}
                    >
                      {/* --- BUS FINDER (DIRECT ROUTE UI) REDESIGNED --- */}
                      {result.type === 'direct' && appView === 'planner' && (
                        <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-[#2563eb]/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                          {/* Accent left border */}
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#2563eb] to-blue-400"></div>
                          
                          <div className="p-5 sm:p-6">
                            {/* Header: Bus Info & Occupancy */}
                            <div className="flex items-center justify-between mb-5 pl-2">
                                <div className="flex items-center gap-3">
                                  <div className="bg-slate-900 text-white font-black text-xl px-3.5 py-1.5 rounded-xl shadow-md tracking-tight group-hover:bg-[#2563eb] transition-colors">
                                    {busNum1}
                                  </div>
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">{translateBusType(result.bus.type)}</span>
                                </div>
                                <div className={`text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm ${result.occupancy >= 100 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                  <Users className="w-3.5 h-3.5" /> {result.occupancy}% {t('full')}
                                </div>
                            </div>

                            {/* Journey Timeline Block */}
                            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 flex items-center justify-between ml-2">
                                {/* Origin */}
                                <div className="w-[35%] text-left">
                                  <p className="text-lg sm:text-xl font-black text-slate-800 leading-tight mb-2 truncate">{tLoc(fromStop)}</p>
                                  <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#2563eb] bg-white px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm">
                                    <Clock className="w-3.5 h-3.5 opacity-70"/> {t('eta_text')} {formatTimeOffset(result.bus.scheduledTime, result.fromIdx * 3)}
                                  </div>
                                </div>

                                {/* Center visual & Stops */}
                                <div className="w-[30%] flex flex-col items-center px-2 relative -mt-4">
                                  <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm mb-2 z-10 whitespace-nowrap">
                                     {formatTimeDuration(result.totalMins)}
                                  </span>
                                  <div className="w-full flex items-center z-0 -mt-1">
                                      <div className="w-2 h-2 rounded-full border-2 border-slate-300 bg-white z-10"></div>
                                      <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                                      <div className="w-2 h-2 rounded-full border-2 border-[#2563eb] bg-white z-10"></div>
                                  </div>
                                  <span className="text-[10px] font-black text-slate-400 mt-1.5 uppercase tracking-wider whitespace-nowrap">{result.stopsCount} {t('stops_count')}</span>
                                </div>

                                {/* Destination */}
                                <div className="w-[35%] text-right flex flex-col items-end">
                                  <p className="text-lg sm:text-xl font-black text-slate-800 leading-tight mb-2 truncate">{tLoc(toStop)}</p>
                                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                                    {t('arrival_text')} {formatTimeOffset(result.bus.scheduledTime, (result.fromIdx * 3) + result.d1_time)} <Clock className="w-3.5 h-3.5 text-slate-400"/>
                                  </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --- MULTI-LEG PLANNER UI (ALL TYPES) REDESIGNED --- */}
                      {appView === 'multi_leg' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                           {/* Highlight Insight Banner */}
                           <div className={`px-5 py-3.5 border-b flex justify-between items-center flex-wrap gap-3 ${tipColor}`}>
                               <span className="font-black text-[13px] flex items-center gap-2 uppercase tracking-wide">{t(tipKey)}</span>
                               <div className="flex items-center gap-4 bg-white/60 px-3 py-1.5 rounded-lg shadow-sm border border-white/50">
                                  <span className="font-black text-[12px] flex items-center gap-1.5 tracking-wide text-slate-700"><Clock className="w-4 h-4 text-slate-500"/> {formatTimeDuration(result.totalMins)}</span>
                                  <div className="w-px h-4 bg-slate-300"></div>
                                  <span className="font-black text-[12px] flex items-center gap-1.5 tracking-wide text-slate-700"><Coins className="w-4 h-4 text-slate-500"/> ₹{fare}</span>
                               </div>
                           </div>

                           <div className="p-5 sm:p-6 relative">
                              {/* Continuous Vertical Timeline Line */}
                              <div className="absolute left-[39px] sm:left-[43px] top-12 bottom-12 w-1 bg-slate-100 rounded-full"></div>

                              {/* Leg 1 */}
                              {(result.bus1 || result.bus) && (() => {
                                const b = result.bus1 || result.bus;
                                const dest = result.t1 || result.transferStop || toStop;
                                return (
                                <div className="relative flex items-center gap-4 sm:gap-6 mb-5 group">
                                   <div className="relative z-10 w-14 h-14 bg-slate-800 text-white rounded-2xl shadow-md flex flex-col items-center justify-center border-2 border-white group-hover:bg-[#2563eb] group-hover:scale-105 transition-all flex-shrink-0">
                                      <Bus className="w-4 h-4 mb-0.5 text-blue-200 group-hover:text-white" />
                                      <span className="font-black text-sm">{getBusNum(b.route)}</span>
                                   </div>
                                   <div className="flex-1 bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 group-hover:border-blue-200 transition-all shadow-sm group-hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-black text-slate-800 mb-2 flex-wrap">
                                          <span className="truncate max-w-[40%]">{tLoc(fromStop)}</span>
                                          <ArrowRight className="text-slate-400 w-4 h-4 shrink-0" />
                                          <span className="truncate max-w-[40%]">{tLoc(dest)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="bg-slate-200/70 text-slate-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">{translateBusType(b.type)}</span>
                                          <span className="flex items-center gap-1 text-[#2563eb] text-[11px] font-black tracking-wide bg-blue-50 px-2 py-1 rounded border border-blue-100"><Clock className="w-3 h-3" /> {formatTimeDuration(result.d1_time)}</span>
                                        </div>
                                      </div>
                                      <button onClick={(e) => { e.stopPropagation(); executeJourneyPlan(fromStop, dest, 'planner'); }} className="shrink-0 w-full sm:w-auto bg-white border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 font-black text-xs shadow-sm">
                                        <Search className="w-3.5 h-3.5" /> {t('find_bus_btn')}
                                      </button>
                                   </div>
                                </div>
                                );
                              })()}

                              {/* Leg 2 */}
                              {result.bus2 && (() => {
                                return (
                                <div className="relative flex items-center gap-4 sm:gap-6 mb-5 group">
                                   <div className="relative z-10 w-14 h-14 bg-slate-800 text-white rounded-2xl shadow-md flex flex-col items-center justify-center border-2 border-white group-hover:bg-[#2563eb] group-hover:scale-105 transition-all flex-shrink-0">
                                      <Bus className="w-4 h-4 mb-0.5 text-blue-200 group-hover:text-white" />
                                      <span className="font-black text-sm">{busNum2}</span>
                                   </div>
                                   <div className="flex-1 bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 group-hover:border-blue-200 transition-all shadow-sm group-hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-black text-slate-800 mb-2 flex-wrap">
                                          <span className="truncate max-w-[40%]">{tLoc(result.t1 || result.transferStop)}</span>
                                          <ArrowRight className="text-slate-400 w-4 h-4 shrink-0" />
                                          <span className="truncate max-w-[40%]">{tLoc(result.t2 || toStop)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="bg-slate-200/70 text-slate-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">{translateBusType(result.bus2.type)}</span>
                                          <span className="flex items-center gap-1 text-[#2563eb] text-[11px] font-black tracking-wide bg-blue-50 px-2 py-1 rounded border border-blue-100"><Clock className="w-3 h-3" /> {formatTimeDuration(result.d2_time)}</span>
                                        </div>
                                      </div>
                                      <button onClick={(e) => { e.stopPropagation(); executeJourneyPlan(result.t1 || result.transferStop, result.t2 || toStop, 'planner'); }} className="shrink-0 w-full sm:w-auto bg-white border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 font-black text-xs shadow-sm">
                                        <Search className="w-3.5 h-3.5" /> {t('find_bus_btn')}
                                      </button>
                                   </div>
                                </div>
                                );
                              })()}

                              {/* Leg 3 */}
                              {result.bus3 && (() => {
                                return (
                                <div className="relative flex items-center gap-4 sm:gap-6 group">
                                   <div className="relative z-10 w-14 h-14 bg-slate-800 text-white rounded-2xl shadow-md flex flex-col items-center justify-center border-2 border-white group-hover:bg-[#2563eb] group-hover:scale-105 transition-all flex-shrink-0">
                                      <Bus className="w-4 h-4 mb-0.5 text-blue-200 group-hover:text-white" />
                                      <span className="font-black text-sm">{busNum3}</span>
                                   </div>
                                   <div className="flex-1 bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 group-hover:border-blue-200 transition-all shadow-sm group-hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-black text-slate-800 mb-2 flex-wrap">
                                          <span className="truncate max-w-[40%]">{tLoc(result.t2)}</span>
                                          <ArrowRight className="text-slate-400 w-4 h-4 shrink-0" />
                                          <span className="truncate max-w-[40%]">{tLoc(toStop)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="bg-slate-200/70 text-slate-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">{translateBusType(result.bus3.type)}</span>
                                          <span className="flex items-center gap-1 text-[#2563eb] text-[11px] font-black tracking-wide bg-blue-50 px-2 py-1 rounded border border-blue-100"><Clock className="w-3 h-3" /> {formatTimeDuration(result.d3_time)}</span>
                                        </div>
                                      </div>
                                      <button onClick={(e) => { e.stopPropagation(); executeJourneyPlan(result.t2, toStop, 'planner'); }} className="shrink-0 w-full sm:w-auto bg-white border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 font-black text-xs shadow-sm">
                                        <Search className="w-3.5 h-3.5" /> {t('find_bus_btn')}
                                      </button>
                                   </div>
                                </div>
                                );
                              })()}
                           </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}

          {/* ROUTES DIRECTORY VIEW */}
          {appView === 'routes' && (
            <div className="max-w-6xl mx-auto flex flex-col gap-8 w-full pb-10">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 relative z-10 gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <List className="w-8 h-8 text-[#2563eb]" /> {t('routes_dir')}
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium max-w-2xl text-[15px]">{t('routes_dir_desc')}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-blue-700 font-bold text-sm shadow-sm inline-flex items-center gap-2 whitespace-nowrap">
                     <Activity className="w-4 h-4" /> {Array.from(new Map(buses.map(b => [b.route, b])).values()).length} {t('active_routes')}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 relative z-10">
                  {Array.from(new Map(buses.map(b => [b.route, b])).values()).map((bus, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 md:p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#2563eb] to-indigo-400 transform origin-top group-hover:scale-y-110 transition-transform duration-300"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
                            <div className="flex items-center gap-4 md:gap-5">
                                <div className="bg-[#2563eb] text-white p-3 md:p-4 rounded-2xl font-black text-xl md:text-2xl min-w-[5rem] text-center shadow-md group-hover:bg-blue-700 transition-colors">
                                    {bus.route.split(' - ')[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">{getTranslatedRouteDesc(bus.route)}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className="text-[10px] md:text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-widest flex items-center gap-1.5">
                                            <Zap className="w-3 h-3" /> {translateBusType(bus.type)}
                                        </span>
                                        <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-widest border border-slate-200">
                                            {tDepot(bus.depot)} {t('depot_tag')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t border-slate-100 pt-4 md:pt-0 md:border-0">
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                                    <MapPin className="w-4 h-4 text-[#2563eb]" />
                                    <span className="text-sm font-black text-slate-700">{bus.stops.length} <span className="text-slate-500 font-bold ml-0.5">{t('stops')}</span></span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-2 pt-5 border-t border-slate-100/80">
                            <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                                <Route className="w-4 h-4 text-slate-300" /> {t('route_path')}
                            </p>
                            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-2">
                                {bus.stops.map((stop, sIdx) => (
                                <React.Fragment key={sIdx}>
                                    <span className={`text-[12px] md:text-[13px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${sIdx === 0 || sIdx === bus.stops.length - 1 ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 group-hover:border-slate-300'}`}>
                                    {tLoc(stop.name)}
                                    </span>
                                    {sIdx < bus.stops.length - 1 && (
                                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                    )}
                                </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BUS SCHEDULE VIEW */}
          {appView === 'schedule' && (
            <div className="max-w-5xl mx-auto flex flex-col gap-6 w-full pb-10">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
                
                <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-white relative z-10">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-2 tracking-tight">
                    <CalendarDays className="h-7 w-7 text-[#2563eb]" />
                    {t('schedule_title')}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 flex items-center gap-2 ml-10">
                    <Route className="w-4 h-4 text-slate-400" /> {t('route_505')}: {tLoc('Patancheru')} ↔ {tLoc('JNTUH Sulthanpur')}
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">{t('bus_no')}</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">{t('start_time')}</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">{t('time_slot')}</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">{t('expected_crowd')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {buses
                        .filter(b => b.route.includes('505 - JNTUH') || b.route.includes('505 - Patancheru'))
                        .filter(b => b.type === 'PALLEVELUGU')
                        .sort((a, b) => parseTime(a.scheduledTime) - parseTime(b.scheduledTime))
                        .map((bus, idx) => (
                          <tr key={bus.id} className="hover:bg-blue-50/60 transition-colors cursor-pointer group" onClick={() => openBusDetails(bus.id)}>
                            <td className="px-8 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold shadow-sm group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                                        <Bus className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-[15px] text-slate-800 group-hover:text-[#2563eb] transition-colors">{bus.id}</span>
                                </div>
                            </td>
                            <td className="px-8 py-4">
                                <span className="font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl text-[14px] border border-slate-200/60 shadow-sm inline-flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" /> {bus.scheduledTime}
                                </span>
                            </td>
                            <td className="px-8 py-4">
                                <span className="font-bold text-slate-600 text-[14px]">{translateTimeSlot(bus.timeSlot)}</span>
                            </td>
                            <td className="px-8 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border ${
                                    bus.crowdLevel === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                    bus.crowdLevel === 'Medium-High' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                    <Users className="w-3.5 h-3.5" /> {translateCrowdLevel(bus.crowdLevel)}
                                </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DEVELOPERS CORNER VIEW */}
          {appView === 'developers' && (
            <div className="max-w-5xl mx-auto flex flex-col gap-6 w-full pb-10">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-[#0033a0] z-0"></div>

                <div className="relative z-10 mt-12 mb-8 px-6">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-lg flex items-center justify-center border-4 border-slate-50 mb-6">
                        <Code className="h-10 w-10 text-[#2563eb]" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Developer's Corner</h2>
                    <p className="text-lg font-bold text-[#2563eb] mt-2">JNTUH University College of Engineering Sultanpur</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Branch: Cyber Security CSE(CS) • 2nd Year</p>
                </div>

                <div className="p-6 sm:p-10 pt-0 max-w-3xl mx-auto w-full">
                    {/* Team Members */}
                    <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-100 flex flex-col">
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-2"><Users className="w-4 h-4"/> Project Team</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                            <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center h-full min-h-[5rem]">
                                <h4 className="font-black text-slate-800 text-sm leading-snug">Marepally Sreekar<br/>Kumar Netha</h4>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center h-full min-h-[5rem]">
                                <h4 className="font-black text-slate-800 text-sm leading-snug">Guguloth<br/>Parichaya</h4>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center h-full min-h-[5rem]">
                                <h4 className="font-black text-slate-800 text-sm leading-snug">Misba<br/>Sultana</h4>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center h-full min-h-[5rem]">
                                <h4 className="font-black text-slate-800 text-sm leading-snug">Thipris<br/>Shivaraj</h4>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}