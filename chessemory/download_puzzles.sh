DATA_DIR=$(dirname $0)/../data/
if [ ! -d $DATA_DIR ]; then
    mkdir $DATA_DIR
fi
echo "Downloading lichess puzze data..."
echo PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningFamily,OpeningVariation > $DATA_DIR/puzzles.csv
curl https://database.lichess.org/lichess_db_puzzle.csv.bz2 | bzcat -d >> $DATA_DIR/puzzles.csv
echo "Download complete"
