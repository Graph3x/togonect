from psycopg2.extras import execute_values
import psycopg2
from config import settings
import sys
import utils
import time

############### IN DEVELOPMENT, does age tokens by value, but there is no implementation of expired tokens #########


def get_expirations(con):
    cur = con.cursor()

    cur.execute("SELECT id, token_expiration FROM users;")
    exps = cur.fetchall()

    cur.close()
    return exps


def get_expired_tokens(con):
    cur = con.cursor()

    cur.execute("SELECT id, token FROM users WHERE token_expiration < 0")
    exps = cur.fetchall()

    cur.close()
    return exps


def print_table(con):
    cur = con.cursor()
    cur.execute("SELECT id, token_expiration, token FROM users")
    rows = cur.fetchall()
    for row in rows:
        print(f"{row[0]} {row[1]} {row[2][30:50]}")

    cur.close()


def update(con, data):
    cur = con.cursor()
    execute_values(cur, """UPDATE users 
                           SET token_expiration = update_payload.token_expiration 
                           FROM (VALUES %s) AS update_payload (id, token_expiration) 
                           WHERE users.id = update_payload.id""", data)
    con.commit()
    cur.close()


def udpate_data(data, value):
    for i, row in enumerate(data):
        new_row = list(row)
        new_row[1] -= value
        data[i] = new_row
    return data


def update_tokens(data):
    for i, row in enumerate(data):
        new_row = list(row)
        email = row[1][:-256]
        new_row[1] = utils.generate_token(email, settings.TOKEN_LEN)
        data[i] = new_row
    return data


def reset_tokens(con, data):
    cur = con.cursor()
    execute_values(cur, """UPDATE users 
                           SET token_expiration = 30, 
                           token = update_payload.token
                           FROM (VALUES %s) AS update_payload (id, token) 
                           WHERE users.id = update_payload.id""", data)
    con.commit()
    cur.close()


def main():
    con = None

    try:
        con = psycopg2.connect(
            host=settings.POSTGRES_SERVER,
            database=settings.POSTGRES_DB,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD)

        print_table(con)

        data = get_expirations(con)
        udata = udpate_data(data, 1)

        update(con, udata)

        expired_tokens = get_expired_tokens(con)
        if expired_tokens:
            updated_tokens = update_tokens(expired_tokens)
            reset_tokens(con, updated_tokens)

        print("rows updated:")
        print_table(con)

    except psycopg2.DatabaseError as e:

        print(f'Error {e}')
        sys.exit(1)

    finally:
        if con:
            con.close()


def main_wrapper():
    while True:
        time.sleep(86400)  # One Day
        main()


if __name__ == '__main__':
    main_wrapper()
