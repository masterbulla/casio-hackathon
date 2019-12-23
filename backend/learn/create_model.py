#!/usr/bin/env python
# coding: utf-8

# In[1]:


#ライブラリ

import numpy as np
import pandas as pd
from sklearn import svm
from sklearn.model_selection import GridSearchCV
import pickle


# In[2]:


#設定

#TRAIN_FILE_NAME = "0_0_20000206014956JST_resample_All.csv"
TRAIN_FILE_NAME = "0_0_20191217132856JST_resample_All.csv"
TEST_FILE_NAME = "0_0_20000206014956JST_resample_All.csv"
MODEL_FILE_NAME = "model.binary"
PREDICT_FILE_NAME = "predict.csv"
COLUMNS = ["AccX", "AccY", "AccZ", "GyroX", "GyroY", "GyroZ"]
MAX_TRACE = 10


# In[3]:


#0秒前〜(MAX_TRACE)秒前のデータを一列に並べる

df_train = pd.read_csv(TRAIN_FILE_NAME, index_col=0)
df_train = df_train.loc[:, COLUMNS]
df_train.columns = [col+"_0" for col in COLUMNS]

for i in range(MAX_TRACE):
    columns = [col+"_{}".format(i) for col in COLUMNS]
    new_columns = [col+"_{}".format(i+1) for col in COLUMNS]
    
    for column, new_column in zip(columns, new_columns):
        df_train.loc[:, new_column] = df_train.loc[:, column].rolling(2).sum() - df_train.loc[:, column]

df_train = df_train.tail(len(df_train)-MAX_TRACE)


# In[4]:


#分類モデル作成

X_train = df_train.values
y_train = np.random.randint(0, 2, len(df_train))

parameters = {"kernel":("linear", "rbf"), "C":[1, 10]}
svc = svm.SVC()
clf = GridSearchCV(svc, parameters)
clf.fit(X_train, y_train)

with open(MODEL_FILE_NAME, "wb") as f:
    pickle.dump(clf , f)


# In[ ]:




