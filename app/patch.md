### Analyse de la Faille :

    Api.php Vulnérabilité trouvé en fouillant dans la console, l'appel fetch :
        ""
fetch('/app/api.php', {
  method: 'POST', 
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'action=add_points&points=1000000'
}).then(r => r.json())
        ""
fonctionne bien. Tout les end point sont à revoir .


#### Checklist des Endpoints à Sécuriser :

    - add_points ← CRITIQUE

    - deduct_points

    - daily_login_bonus

    - social_share

    - credit_points_immediate ← À SUPPRIMER

    - create_lemon_checkout

    - credit_crypto_points