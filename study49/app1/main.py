from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("Pyspark WordCount Test").master("spark://localhost:7077").getOrCreate()
