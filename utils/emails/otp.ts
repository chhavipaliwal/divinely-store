export const otpEmail = ({
  otp,
  location
}: {
  otp: string | number;
  location?: string;
}) => {
  return `
    <div>
  <table
    width="100%"
    border="0"
    cellspacing="0"
    cellpadding="0"
    style="width: 100% !important"
  >
    <tbody>
      <tr>
        <td align="center">
          <table
            style="
              border: 1px solid #eaeaea;
              border-radius: 5px;
              margin: 40px 0;
            "
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="40"
          >
            <tbody>
              <tr>
                <td align="center">
                  <div
                    style="
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                        'Droid Sans', 'Helvetica Neue', sans-serif;
                      text-align: left;
                      width: 465px;
                    "
                  >
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      style="width: 100% !important"
                    >
                      <tbody>
                        <tr>
                          <td align="center">
                            <div>
                              <img
                                src="https://store.divinely.dev/logo.png"
                                width="40"
                                height="37"
                                alt="Divinely Store"
                              />
                            </div>
                            <h1
                              style="
                                color: #000;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
                                  'Cantarell', 'Fira Sans', 'Droid Sans',
                                  'Helvetica Neue', sans-serif;
                                font-size: 24px;
                                font-weight: normal;
                                margin: 30px 0;
                                padding: 0;
                              "
                            >
                              Verify your email to sign up for
                              <strong style="color: #000; font-weight: bold"
                                >Divinely Store</strong
                              >
                            </h1>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                          'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                          sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      We have received a sign-up attempt from
                      <strong style="color: #000; font-weight: bold"
                        >${location || 'Unknown Location'}</strong
                      >.
                    </p>
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                          'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                          sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      To complete the sign-up process; enter the 4-digit code in
                      the original window:
                    </p>
                    <br />

                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      style="width: 100% !important"
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            bgcolor="#f6f6f6"
                            valign="middle"
                            height="40"
                            style="
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
                                'Cantarell', 'Fira Sans', 'Droid Sans',
                                'Helvetica Neue', sans-serif;
                              font-size: 16px;
                              font-weight: bold;
                            "
                          >
                            ${otp}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <br />

                    <hr
                      style="
                        border: none;
                        border-top: 1px solid #eaeaea;
                        margin: 26px 0;
                        width: 100%;
                      "
                    />
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                          'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                          sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      Please note that by completing your sign-up you are
                      agreeing to our
                      <a
                        href="https://store.divinely.dev/terms"
                        style="color: #067df7; text-decoration: none"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://vercel.com/terms&amp;source=gmail&amp;ust=1741438120919000&amp;usg=AOvVaw1zyDrppzAnBQY2kRuQAxpr"
                        >Terms of Service</a
                      >
                      and
                      <a
                        href="https://store.divinely.dev/privacy"
                        style="color: #067df7; text-decoration: none"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://vercel.com/privacy&amp;source=gmail&amp;ust=1741438120919000&amp;usg=AOvVaw3KZQ_eoQDDEQiT4-TcCgOf"
                        >Privacy Policy</a
                      >:
                    </p>
                    <hr
                      style="
                        border: none;
                        border-top: 1px solid #eaeaea;
                        margin: 26px 0;
                        width: 100%;
                      "
                    />
                    <p
                      style="
                        color: #666666;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                          'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                          sans-serif;
                        font-size: 12px;
                        line-height: 24px;
                      "
                    >
                      If you didn't attempt to sign up but received this email,
                      or if the location doesn't match, you can ignore this
                      email. No account will be created. Don't share or forward
                      the 4-digit code with anyone. Our customer service will
                      never ask for it. Do not read this code out loud. Be
                      cautious of phishing attempts and always verify the sender
                      and domain (<a
                        href="https://store.divinely.dev"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=http://vercel.com&amp;source=gmail&amp;ust=1741438120919000&amp;usg=AOvVaw0Bc6Wzdy3equ5H32DSmw7S"
                        >divinely.dev</a
                      >) before acting. If you are concerned about your
                      account's safety, please visit our
                      <a
                        href="https://store.divinely.dev/help"
                        style="color: #067df7; text-decoration: none"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://vercel.com/help&amp;source=gmail&amp;ust=1741438120919000&amp;usg=AOvVaw3nMERmLhWdtu5UhYa7QQt7"
                        >Help page</a
                      >
                      to get in touch with us.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>`;
};
