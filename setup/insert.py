import os
import csv

from dotenv import load_dotenv

import psycopg2 as pg
from psycopg2.extras import execute_values

tables = ['player', 'umpire', 'team', 'owner', 'venue', 'match',
          'player_match', 'umpire_match', 'ball_by_ball']


def ddl(cur, ddl_file):
    with open(ddl_file, 'r') as file:
        cur.execute(file.read())


def data(cur, data_folder):
    for table in tables:
        with open(os.path.join(data_folder, table + '.csv'), 'r') as file:
            reader = csv.reader(file)
            next(reader)

            values = []
            for row in reader:
                values.append(tuple([None if x == 'NULL' else x for x in row]))
            sql = 'INSERT INTO {} VALUES %s'.format(table)
            execute_values(cur, sql, values)


if __name__ == '__main__':
    load_dotenv()

    conn = pg.connect(database=os.getenv('DB_DATABASE'),
                      user=os.getenv('DB_USER'), password=os.getenv('DB_PASSWORD'),
                      host=os.getenv('DB_HOST'), port=os.getenv('DB_PORT'))
    cur = conn.cursor()

    ddl(cur, 'lab4db.ddl')
    data(cur, './data/')
    conn.commit()

    cur.close()
    if (conn):
        conn.close()
