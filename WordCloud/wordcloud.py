def stock_wordcloud(stock_name):

    #inspired by https://medium.com/illumination/scraping-news-and-creating-a-word-cloud-in-python-10ea312c49ba
    import requests
    import urllib.request
    import time
    import spacy
    from bs4 import BeautifulSoup
    import pandas as pd

    # Set up the scrape
    numResults=150
    url ="https://www.google.com/search?q=stock+symbol+"+stock_name+"&tbm=nws&hl=en&num="+str(numResults)
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Get the headline text
    results = soup.find_all("div", attrs = {"class": "ZINbbc"})
    headlines = []
    for result in results:
        try:
            headline = result.find("div", attrs={"class":"vvjwJb"}).get_text()
            if headline != "": 
                headlines.append(headline)
        except:
            continue
    # flattens string
    text_h = "".join(headlines)

    # Get the preview text
    results = soup.find_all("div", attrs = {"class": "ZINbbc"})
    descriptions = []
    for result in results:
        try:
            description = result.find("div", attrs={"class":"s3v9rd"}).get_text()
            if description != "": 
                # remove the "1 day ago" etc.
                description = description[description.find("·")+1:]
                descriptions.append(description)
        except:
            continue
    # flattens string
    text_p = "".join(descriptions)
    
    # combine strings
    text = text_h +" "+ text_p

    # Use spacy to filter down to adjectives
    sp = spacy.load('en_core_web_sm')
    doc = sp(text)
    newText_dict = {}
    for word in doc:
        if word.text.lower() not in ["inc", "inc.","nasdaq","dow"]:
            if word.pos_ in ["ADJ","PROPN","INTJ","ADV"]:
                if word.text.lower() in list(newText_dict.keys()):
                    newText_dict[word.text.lower()]["Counts"]=newText_dict[word.text.lower()]["Counts"]+1
                else:
                    newText_dict[word.text.lower()]={"Words":word.text.lower(),
                                                    "POS": word.pos_,
                                                    "Counts": 1}
    # jsonify list of dictionaries
    return list(newText_dict.values())
